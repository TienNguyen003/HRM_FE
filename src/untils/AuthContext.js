import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { introspect, getMyInfo, refreshToken } from '../component/globalstyle/checkToken';
import { toast } from 'react-toastify';
import Load from '../component/globalstyle/Loading/load';

export const AuthContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, user: action.payload, isAuthenticated: true };
        case 'LOGOUT':
            return { ...state, user: null, isAuthenticated: false, account: null };
        case 'SET_ACCOUNT':
            return { ...state, account: action.payload };
        case 'REFRESH_TOKEN':
            return { ...state, user: action.payload, isAuthenticated: true };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        isAuthenticated: false,
        account: null,
        loading: true,
    });

    const redirectLogin = () => {
        return (window.location.href = '/login');
    };

    const login = async (user) => {
        localStorage.setItem('authorizationData', user.token);
        dispatch({ type: 'LOGIN', payload: user });
        await getInfo(user.token);
        window.location.href = '/';
    };

    const logout = () => {
        localStorage.removeItem('authorizationData');
        dispatch({ type: 'LOGOUT' });
        redirectLogin();
    };

    const refresh = async (token) => {
        const newToken = await refreshToken(token);
        localStorage.setItem('authorizationData', newToken);
        dispatch({ type: 'REFRESH_TOKEN', payload: newToken });
        await getInfo(newToken);
    };

    const getInfo = async (token) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const getAcc = await getMyInfo(token);
            dispatch({ type: 'SET_ACCOUNT', payload: getAcc });
        } catch (error) {
            console.log('Error fetching data:', error);
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const checkRole = (token, permission, isCheck) => {
        if (token == null) redirectLogin();

        if (!Array.isArray(token)) {
            let check = token === permission ? true : false;
            return check;
        }

        let flag = token.some((item) => item.name === permission);
        if (isCheck && !flag) {
            window.location.href = window.location.href + '/404';
        }
        return flag;
    };

    const checkRolePermission = (token, permission) => {
        if (token === null) redirectLogin();
        let flag = false;
        if (permission === '') return true;
        else flag = token.some((item) => permission.includes(item.name));
        return flag;
    };

    useEffect(() => {
        const checkLoginStatus = async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            dispatch({ type: 'SET_LOADING', payload: true });
            const token = localStorage.getItem('authorizationData');
            if (token) {
                try {
                    const validToken = await introspect(token);
                    if (validToken && validToken.result.valid) {
                        dispatch({ type: 'LOGIN', payload: token });
                        await getInfo(token);
                    } else {
                        logout();
                        toast.error('Phiên đăng nhập đã hết, vui lòng đăng nhập lại.');
                    }
                } catch (error) {
                    console.error('Lỗi khi kiểm tra token:', error);
                    logout();
                }
            } else dispatch({ type: 'SET_LOADING', payload: false });
        };

        checkLoginStatus();
    }, []);

    if (state.loading) {
        return <Load />;
    }

    return (
        <AuthContext.Provider value={{ state, login, logout, redirectLogin, refresh, checkRole, checkRolePermission }}>
            {!state.loading ? children : <div>Loading...</div>}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
