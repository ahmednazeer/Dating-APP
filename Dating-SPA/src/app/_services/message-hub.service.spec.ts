/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MessageHubService } from './message-hub.service';

describe('Service: MessageHub', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageHubService]
    });
  });

  it('should ...', inject([MessageHubService], (service: MessageHubService) => {
    expect(service).toBeTruthy();
  }));
});
