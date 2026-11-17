import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { routes } from '../../app.routes';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { GLOBAL_CONSTANT } from '../constant/global';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router)
    if (req.url.includes('login')) {
        return next(req);
    } else {
        const token = localStorage.getItem(GLOBAL_CONSTANT.LOCAL_TOKEN_KEY);
        const cloneRequest = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
        return next(cloneRequest);
    }
}
