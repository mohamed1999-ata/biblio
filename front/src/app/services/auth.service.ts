import { Injectable } from '@angular/core';
 import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  messageUrl = 'http://localhost:3000/api/message';
  getMessageUrl = 'http://localhost:3000/api/messages/';

  constructor( private http : HttpClient) { }
  verifEmail(data : any )   {
    return   this.http.post( "http://localhost:5000/forgot-password" , data) ;
  }

  resetPassword(data:any){
     return this.http.post( "http://localhost:5000/reset-password/:${token}" , data )
  }

     // save messagep
     saveMessage(user:any) {
      return this.http.post<any>(this.messageUrl, user);
     }
       // get Email Marketing Messages
       allMessages(newUser:any) {
        return this.http.get<any>(this.getMessageUrl + newUser.room);
      }


      login( body : any){
        return this.http.post("http://localhost:5000/api/auth/sign-in", body)
      }

      
      register( body : any){
        return this.http.post("http://localhost:5000/api/auth/sign-up", body)
      }

      saveToken(data : any){
          localStorage.setItem("token" , JSON.stringify(data))
      }

      saveUser(data : any){
        localStorage.setItem("user" , JSON.stringify(data))
    }
      

 
}
