import { Injectable } from '@angular/core';

@Injectable()
export class ConfiguratonService {
  public SERVER_ADDR: string = 'http://alexeytimkin.synology.me:7070';
  public SERVER_ADDR2: string = 'http://localhost:8080';
  public IMAGE_BASEURL: string = 'http://alexeytimkin.synology.me:7070/movienizer-photos/resources/images/Covers/';
}
