import { render, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/Login';
import axios from 'axios';
jest.mock('axios', () => {
  return {
    post: jest.fn(),
  };
});

window.alert = jest.fn();

const errors = {
  emailRequired: 'Email should not be empty',
  emailInvalid: 'Email is not valid',
  passwordRequired: 'Password should not be empty',
};

const authCredential = {
  email: 'eve.holt@reqres.in',
  password: 'cityslicka',
};

const mockedResolveData = {
  token: 'QpwL5tke4Pnpja7X4',
};

const mockedRejectedData = 'Request failed with status code 400';

describe('Login', () => {
  const renderComponent = () => render(<Login />);

  it('renders email & password labels & inputs and login correctly', () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId('emailInput')).toBeInTheDocument();
    expect(getByTestId('pwdInput')).toBeInTheDocument();
    expect(getByTestId('loginBtn')).toBeInTheDocument();
  });

  describe('clicks login button', () => {
    describe('triggers errors in case of', () => {
      it('email null and password null', async () => {
        const { getByTestId, findByTestId, findByText, unmount } = renderComponent();
        const emailInput = getByTestId('emailInput');
        const passwordInput = getByTestId('pwdInput');

        expect((emailInput as HTMLInputElement)?.value).toBe('');
        expect((passwordInput as HTMLInputElement)?.value).toBe('');

        fireEvent.click(await findByTestId('loginBtn'));
        expect(await findByText(errors.emailRequired)).toBeInTheDocument();
        expect(await findByText(errors.passwordRequired)).toBeInTheDocument();

        unmount();
      });

      it('email invalid and password null', async () => {
        const { getByTestId, findByTestId, findByText, unmount } = renderComponent();
        const emailInput = getByTestId('emailInput');
        const passwordInput = getByTestId('pwdInput');

        fireEvent.change(emailInput, {
          target: {
            value: 'eve.holt',
          },
        });

        fireEvent.change(passwordInput, {
          target: {
            value: '',
          },
        });

        expect((emailInput as HTMLInputElement)?.value).toBe('eve.holt');
        expect((passwordInput as HTMLInputElement)?.value).toBe('');

        fireEvent.click(await findByTestId('loginBtn'));
        expect(await findByText(errors.emailInvalid)).toBeInTheDocument();
        expect(await findByText(errors.passwordRequired)).toBeInTheDocument();

        unmount();
      });
    });

    describe('calls api to validate login credential and returns', () => {
      it('token data successfully', async () => {
        const { getByTestId, unmount } = renderComponent();
        const emailInput = getByTestId('emailInput');
        const passwordInput = getByTestId('pwdInput');

        fireEvent.change(emailInput, {
          target: {
            value: authCredential.email,
          },
        });
        fireEvent.change(passwordInput, {
          target: {
            value: authCredential.password,
          },
        });

        expect((emailInput as HTMLInputElement)?.value).toBe(authCredential.email);
        expect((passwordInput as HTMLInputElement)?.value).toBe(authCredential.password);

        const consoleLogSpyOn = jest.spyOn(console, 'log');

        fireEvent.click(getByTestId('loginBtn'));

        await (axios.post as jest.MockedFunction<typeof axios.post>).mockResolvedValueOnce({
          data: mockedResolveData,
        });

        await waitFor(async () => {
          expect(await consoleLogSpyOn).toHaveBeenCalledWith(mockedResolveData);
        });

        unmount();
      });
      it('error message', async () => {
        const { getByTestId, unmount } = renderComponent();
        const emailInput = getByTestId('emailInput');
        const passwordInput = getByTestId('pwdInput');

        fireEvent.change(emailInput, {
          target: {
            value: 'a@a.com',
          },
        });
        fireEvent.change(passwordInput, {
          target: {
            value: authCredential.password,
          },
        });

        expect((emailInput as HTMLInputElement)?.value).toBe('a@a.com');
        expect((passwordInput as HTMLInputElement)?.value).toBe(authCredential.password);

        const consoleLogSpyOn = jest.spyOn(console, 'log');

        fireEvent.click(getByTestId('loginBtn'));

        await (axios.post as jest.MockedFunction<typeof axios.post>).mockRejectedValueOnce({
          message: mockedRejectedData,
        });

        await waitFor(async () => {
          expect(await consoleLogSpyOn).toHaveBeenCalledWith(mockedRejectedData);
        });

        unmount();
      });
    });
  });
});
