import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import {scale} from 'free-transform';
import {styler} from 'free-transform';
import {rotate} from 'free-transform';

@Component({
  selector: 'dynamic-element',
  templateUrl: './dynamic-element.component.html',
  styleUrls: ['./dynamic-element.component.css']
})
export class DynamicElementComponent implements OnInit {

  style = {
    height: '170px',
    width: '300px',
    marginTop: '200px',
    marginLeft: '300px',
    transform: 'rotate(0deg)'
  };
  element = {
    x: 100,
    y: 100,
    scaleX: 1,
    scaleY: 1,
    width: 100,
    height: 100,
    angle: 0,
    scaleLimit: 0.1,
    disableScale: true
  };
  controlsStyle = {};
  elementStyle: any = null;
  state: string = null;
  startX: number = null;
  startY: number = null;
  currentAngle = 0;
  onScale: () => void;

  constructor(public el: ElementRef,
              public renderer: Renderer2) { }

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

  handleResize(event) {
    console.log('handling resize');
    this.state = 'resize';
    this.startX = event.clientX;
    this.startY = event.clientY;
  }
  handleMove(event) {
    if (this.state === 'resize') {
      console.log('x', event.clientX, 'y', event.clientY);
      let height = parseInt(this.style.height.slice(0, -2), 10);
      let width = parseInt(this.style.width.slice(0, -2), 10);
      height += event.clientY - this.startY;
      width += event.clientX - this.startX;
      this.style.height = `${height}px`;
      this.style.width = `${width}px`;
    } else if (this.state === 'rotating') {
      this.style.transform = `rotate(${this.currentAngle++}deg)`;
      console.log(this.style.transform);
    }
  }

  handleRotation(event) {
    this.state = 'rotating';
    this.startX = event.clientX;
    this.startY = event.clientY;
  }

  finishResize(event) {
    this.state = null;
  }
  onScaleHandleMouseDown(event) {
    event.stopPropagation();
    event.preventDefault();
    const drag = scale('br', {
      startX: event.pageX,
      startY: event.pageY,
      scaleFromCenter: event.altKey,
      aspectRatio: event.shiftKey,
      ...this.element,
    }, (payload) => { // {x, y, scaleX, scaleY}
      // dragging
      this.element = { ...this.element, ...payload };
      this.draw();
    });

    const up = () => {
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', up);
    };

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', up);
  }

  onRotateHandleMouseDown (event) {

    event.stopPropagation();
    event.preventDefault();

    const drag = rotate({
      startX: event.pageX,
      startY: event.pageY,
      offsetX: 0, // the offset x of parent (parent.offsetLeft)
      offsetY: 0, // the offset y of parent (parent.offsetTop)
      ...this.element,
    }, (payload) => { // {angle}
      // dragging
      this.element = { ...this.element, ...payload };
      this.draw();
    });

    const up = () => {
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', up);
    };

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', up);
  }

}
