import {
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from '@angular/core';

/** Directive to supply a drag-and-drop files behavior. */
@Directive({
  selector: '[appDragAndDropZone]',
})
export class DragAndDropZoneDirective {
  @HostBinding('class.file-dragover') fileOver = false;

  @Output() fileDropped = new EventEmitter<FileList>();

  constructor(private el: ElementRef<HTMLInputElement>) {
    this.el.nativeElement.classList.add('drag-and-drop-zone');
  }

  /**
   * DragOver listener.
   *
   * @param evt Dragover event.
   */
  @HostListener('dragover', ['$event']) onDragOver(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
  }

  /**
   * Dragleave listener.
   *
   * @param evt Dragleave event.
   */
  @HostListener('dragleave', ['$event']) public onDragLeave(
    evt: DragEvent
  ): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
  }

  /**
   * Drop listener.
   *
   * @param evt Drop event.
   */
  @HostListener('drop', ['$event']) public ondrop(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    const { dataTransfer } = evt;
    if (dataTransfer && dataTransfer.files) {
      const files = dataTransfer.files;
      dataTransfer.items.clear();
      this.fileDropped.emit(files);
    }
  }
}
