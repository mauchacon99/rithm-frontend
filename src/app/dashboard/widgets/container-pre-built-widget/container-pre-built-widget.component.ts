import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { ContainerWidgetPreBuilt } from 'src/models';
/** Container preview build. */
@Component({
  selector: 'app-container-pre-built-widget[editMode]',
  templateUrl: './container-pre-built-widget.component.html',
  styleUrls: ['./container-pre-built-widget.component.scss'],
})
export class ContainerPreBuiltWidgetComponent implements OnInit {
  /** Edit mode dashboard. */
  @Input() editMode!: boolean;

  /** Containers widget pre built. */
  containers: ContainerWidgetPreBuilt[] = [];

  /** Is loading. */
  isLoading = false;

  /** Show message if fail get containers. */
  failedGetContainers = false;

  constructor(
    private documentService: DocumentService,
    private errorService: ErrorService
  ) {}

  /** Init method. */
  ngOnInit(): void {
    this.getContainerWidgetPreBuilt();
  }

  /**
   * Get containers.
   *
   */
  getContainerWidgetPreBuilt(): void {
    this.isLoading = true;
    this.failedGetContainers = false;
    this.documentService
      .getContainerWidgetPreBuilt()
      .pipe(first())
      .subscribe({
        next: (containers) => {
          this.isLoading = false;
          this.failedGetContainers = false;
          this.containers = containers;
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this.failedGetContainers = true;
          this.errorService.logError(error);
        },
      });
  }
}
