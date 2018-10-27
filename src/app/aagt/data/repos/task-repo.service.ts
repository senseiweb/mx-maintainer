import { Injectable } from '@angular/core';
import { BaseRepoService, EmProviderService } from 'app/data';
import { Task, TaskMetadata } from '../models';
import { AagtModule } from 'app/aagt/aagt.module';

@Injectable({
  providedIn: AagtModule
})
export class TaskRepo extends BaseRepoService<Task> {

  constructor(taskMeta: TaskMetadata, emService: EmProviderService) {
    super(taskMeta, emService);
  }

}
