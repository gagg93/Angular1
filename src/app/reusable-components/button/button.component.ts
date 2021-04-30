import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {MyButtonConfig} from '../../my-configs/my-button-config';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {
  @Input() buttonConfig: MyButtonConfig;
  @Output() newButtonEvent = new EventEmitter<string>();


  constructor() {}

  ngOnInit(): void {}

  onBtnClick(action: string): void{
    this.newButtonEvent.emit(action);
  }

}
