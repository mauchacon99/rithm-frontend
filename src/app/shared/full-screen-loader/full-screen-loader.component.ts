import { Component, OnInit } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-full-screen-loader',
  templateUrl: './full-screen-loader.component.html',
  styleUrls: ['./full-screen-loader.component.scss']
})
export class FullScreenLoaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // gsap.set("#Layer_1", {scale:0.25});
    let tl1 = gsap.timeline({repeat: -1, repeatDelay: 0});
    let tl2 = gsap.timeline({repeat: -1, repeatDelay: 0});
    tl1.to('.one', {stopColor: '#229bb5', duration: 1})
        .to('.one', {stopColor: '#667080', duration: 1});
    tl2.to('.two', {stopColor: '#2b3c54', duration: 1})
        .to('.two', {stopColor: '#1d4d91', duration: 1});
  }

}
