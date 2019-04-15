import { Component, OnInit, Renderer2 } from '@angular/core';
import {DynamicElement} from '../models';
import {scale} from 'free-transform';
import {styler} from 'free-transform';
import {rotate} from 'free-transform';

@Component({
  selector: 'dynamic-element',
  templateUrl: './dynamic-element.component.html',
  styleUrls: ['./dynamic-element.component.css']
})
export class DynamicElementComponent implements OnInit {

  element: DynamicElement = {
    x: 100,
    y: 100,
    scaleX: 1,
    scaleY: 1,
    width: '300',
    height: '150',
    angle: 0,
    scaleLimit: 0.1,
    disableScale: true
  };
  controlsStyle: DynamicElement = null;
  elementStyle: DynamicElement = null;

  constructor(public renderer: Renderer2) { }

  ngOnInit() {
    this.draw();
  }

  draw() {
    const {element, controls} = styler({
      x: this.element.x,
      y: this.element.y,
      scaleX: this.element.scaleX,
      scaleY: this.element.scaleY,
      width: this.element.width,
      height: this.element.height,
      angle: this.element.angle,
      disableScale: this.element.disableScale
    });

    this.elementStyle = {
        ...element,
        width: element.width ? `${element.width}px` : null,
        height: element.height ? `${element.height}px` : null,
      };
      this.controlsStyle = {
        ...controls,
        width: `${controls.width}px`,
        height: `${controls.height}px`
    };
  }

  onScaleHandleMouseDown(event) {
    event.stopPropagation();
    event.preventDefault();

    const onDrag = scale('br', {
      startX: event.pageX,
      startY: event.pageY,
      scaleFromCenter: event.altKey,
      aspectRatio: event.shiftKey,
      ...this.element,
    }, (payload: DynamicElement) => {
      this.element = { ...this.element, ...payload };
      this.draw();
    });

    const onMove = this.renderer.listen('document', 'mousemove', onDrag);
    const onUp = this.renderer.listen('document', 'mouseup', () => {
      onMove();
      onUp();
    });
  }

  onRotateHandleMouseDown (event) {

    event.stopPropagation();
    event.preventDefault();

    const onRotate = rotate({
      startX: event.pageX,
      startY: event.pageY,
      offsetX: 0,
      offsetY: 0,
      ...this.element,
    }, (payload: DynamicElement) => {
      this.element = { ...this.element, ...payload };
      this.draw();
    });

    const onMove = this.renderer.listen('document', 'mousemove', onRotate);
    const onUp = this.renderer.listen('document', 'mouseup', () => {
      onMove();
      onUp();
    });
  }

}
