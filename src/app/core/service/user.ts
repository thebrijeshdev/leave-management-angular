import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../enviroments.development";
import { UserLoginModel } from "../models/classes/user-login-model";
import { Observable } from "rxjs";
import { API_Response, LoginResponseData } from "../models/interfaces/common.model";
import { GLOBAL_CONSTANT } from "../constant/global";
import { CreateUserModel } from "../models/classes/create-user.model";

@Injectable({
    providedIn: 'root',
})
export class User {
    http = inject(HttpClient);
    api_url: string = environment.API_URL;

    loginUser(obj: UserLoginModel): Observable<API_Response<LoginResponseData>> {
        return this.http.post<API_Response<LoginResponseData>>(this.api_url + GLOBAL_CONSTANT.API_METHODS.LOGIN, obj)
    }
    CreateUser(obj: CreateUserModel): Observable<API_Response<LoginResponseData>> {
        return this.http.post<API_Response<LoginResponseData>>(this.api_url + GLOBAL_CONSTANT.API_METHODS.CREATE_EMPLOYEE, obj)
    }
}
