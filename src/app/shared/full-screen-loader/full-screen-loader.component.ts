import { Component, OnInit } from '@angular/core';
import { gsap } from 'gsap';
/**
 * Full screen loader.
 * Reusable component.
 */
@Component({
  selector: 'app-full-screen-loader',
  templateUrl: './full-screen-loader.component.html',
  styleUrls: ['./full-screen-loader.component.scss']
})
export class FullScreenLoaderComponent implements OnInit {
  /** Constructor. */
  constructor() {
    // constructor items.
  }
  /**
   * Runs on component load.
   * Animates the logo.
   */
  ngOnInit(): void {
    const tl1 = gsap.timeline({repeat: -1, repeatDelay: 0});
    const tl2 = gsap.timeline({repeat: -1, repeatDelay: 0});
    tl1.to('.one', {stopColor: '#229bb5', duration: 1})
        .to('.one', {stopColor: '#667080', duration: 1});
    tl2.to('.two', {stopColor: '#2b3c54', duration: 1})
        .to('.two', {stopColor: '#1d4d91', duration: 1});
  }

}
