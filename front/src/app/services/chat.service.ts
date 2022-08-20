import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class ChatService {
  private url ="http://localhost:5000/api/messages"
  constructor( private http: HttpClient) { }

  addMessage(data:any){
     return this.http.post(`http://localhost:5000/api/messages/addmsg` , data)
  }

  getMessages(data:any){
    return this.http.post(`http://localhost:5000/api/messages/getmsg` , data)
 }


}