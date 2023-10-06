import React from 'react';

import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginValidationSchema } from '../utils/validation';
import { LOGIN_API_URL } from '../utils/constant';
import { LoginForm } from '../types';

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: yupResolver(loginValidationSchema),
  });

  const onSubmit = (data: LoginForm) => {
    axios
      .post(LOGIN_API_URL, {
        email: data.email,
        password: data.password,
      })
      .then((response) => {
        console.log(response?.data);
        alert('Login Succeed!');
      })
      .catch((error) => {
        console.log(error.message);
        alert(error.message || 'Error found');
      });
  };

  return (
    <div className="register-form vw-100 vh-100 d-flex justify-content-center align-items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-25">
        <h1 className="pb-3">Log in to your account</h1>
        <div className="form-group">
          <input
            type="text"
            placeholder="Email"
            {...register('email')}
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            data-testid="emailInput"
          />
          <div className="invalid-feedback" data-testid="emailAddressError">
            {errors.email?.message}
          </div>
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            {...register('password')}
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            data-testid="pwdInput"
          />
          <div className="invalid-feedback">{errors.password?.message}</div>
        </div>

        <div className="form-group">
          <button
            type="submit"
            className="btn btn-warning w-100"
            data-testid="loginBtn"
            disabled={isSubmitting}>
            {isSubmitting ? 'Loading...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
