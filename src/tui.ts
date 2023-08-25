// Copyright 2023 Im-Beast. All rights reserved. MIT license.
import { BoxObject, Canvas } from "./canvas/mod.ts";
import { Component } from "./component.ts";
import { EmitterEvent, EventEmitter } from "./event_emitter.ts";
import { InputEventRecord } from "./input_reader/mod.ts";
import { Computed, Signal } from "./signals/mod.ts";
import { Style } from "./theme.ts";
import { Rectangle, Stdin, Stdout } from "./types.ts";
import {
  HIDE_CURSOR,
  SHOW_CURSOR,
  USE_PRIMARY_BUFFER,
  USE_SECONDARY_BUFFER,
} from "./utils/ansi_codes.ts";

import { consoleSize } from "./utils/terminal.ts";

export interface TuiOptions {
  style?: Style;
  stdin?: Stdin;
  stdout?: Stdout;
  canvas?: Canvas;
  refreshRate?: number;
}

/**
 * Root element of Tui app.
 *
 * This keeps elements running and manages Components as children.
 *
 * @example
 * ```ts
 * const tui = new Tui({
 *   style: crayon.bgBlack,
 *   refreshRate: 1000 / 60,
 * });
 *
 * tui.dispatch();
 * tui.run();
 * ```
 */
export class Tui extends EventEmitter<
  {
    destroy: EmitterEvent<[]>;
  } & InputEventRecord
> {
  stdin: Stdin;
  stdout: Stdout;
  canvas: Canvas;
  rectangle: Signal<Rectangle>;
  style?: Style;
  children: Component[];
  components: Set<Component>;
  drawnObjects: { background?: BoxObject };
  refreshRate: number;

  #nextUpdateTimeout?: NodeJS.Timeout;

  constructor(options: TuiOptions) {
    super();
    this.stdin = options.stdin ?? process.stdin;
    this.stdout = options.stdout ?? process.stdout;
    this.refreshRate = options.refreshRate ?? 1000 / 60;
    this.canvas = options.canvas ??
      new Canvas({
        stdout: this.stdout,
        size: consoleSize(),
      });

    this.style = options.style;

    this.drawnObjects = {};
    this.components = new Set();
    this.children = [];

    const tuiRectangle = { column: 0, row: 0, width: 0, height: 0 };
    this.rectangle = new Computed(() => {
      const { columns, rows } = this.canvas.size.value;
      tuiRectangle.width = columns;
      tuiRectangle.height = rows;
      return tuiRectangle;
    });

    const updateCanvasSize = () => {
      const { canvas } = this;
      const { columns, rows } = consoleSize();

      const size = canvas.size.peek();

      if (size.columns !== columns || size.rows !== rows) {
        size.columns = columns;
        size.rows = rows;
      }
    };

    updateCanvasSize();

    process.on("SIGWINCH", () => {
      updateCanvasSize();
    });
  }

  addChild(child: Component): void {
    this.children.push(child);
    this.components.add(child);

    if (!child.visible.peek()) return;
    child.draw();
  }

  run(): void {
    const { style, canvas, stdout, drawnObjects } = this;

    if (style) {
      const { background } = drawnObjects;

      background?.erase();

      const box = new BoxObject({
        canvas,
        rectangle: this.rectangle,
        style,
        zIndex: -1,
      });

      drawnObjects.background = box;
      box.draw();
    }

    stdout.write(USE_SECONDARY_BUFFER + HIDE_CURSOR);

    const updateStep = () => {
      canvas.render();
      this.#nextUpdateTimeout = setTimeout(updateStep, this.refreshRate);
    };
    updateStep();
  }

  destroy(): void {
    this.off();

    clearTimeout(this.#nextUpdateTimeout);

    this.stdin.setRawMode(false);
    this.stdout.write(USE_PRIMARY_BUFFER + SHOW_CURSOR);

    for (const component of this.components) {
      component.destroy();
    }
  }

  dispatch(): void {
    const destroyDispatcher = () => {
      this.emit("destroy");
    };

    process.on("SIGBREAK", destroyDispatcher);
    process.on("SIGTERM", destroyDispatcher);
    process.on("SIGINT", destroyDispatcher);
    process.on("exit", destroyDispatcher);

    if (process.platform === "win32") {
      this.on("keyPress", ({ key, ctrl }) => {
        if (ctrl && key === "c") destroyDispatcher();
      });
    }

    this.on("destroy", async () => {
      this.destroy();
      await Promise.resolve();
      process.exit(0);
    });
  }
}
