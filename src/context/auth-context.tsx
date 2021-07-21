import React, { ReactNode, useState } from "react";
import * as auth from '../auth-provider'
import { FullPageLoading, FullPageErrorFallback } from "../components/lib";
import { User } from "../screens/project-list/serach-panel";
import { useMount } from "../utils";
import { http } from "../utils/http";
import { useAsync } from "../utils/useAsync";

import * as authStore from '../store/auth.slice'
import { useDispatch, useSelector } from "react-redux";
import { bootstrap, selectUser } from "../store/auth.slice";
import { useCallback } from "react";

export interface AuthForm {
  username:string;
  password:string
}

export const bootstrapUser = async() => {
  let user = null
  const token = auth.getToken()
  if(token){
    const data = await http('me',{token})
    user = data.user
  }
  return user
}

// const AuthContext = React.createContext<{
//   user:User|null,
//   register:(form:AuthForm)=> Promise<void>,
//   login:(form:AuthForm)=> Promise<void>,
//   logout:()=> Promise<void>,
// }|undefined>(undefined)
// AuthContext.displayName = 'AuthContext'

export const AuthProvider = ({children}:{children:ReactNode}) => {
  // const [user, setUser] = useState<User|null>(null)
  const {data:user, error, isLoading, isIdle, isError, run, setData:setUser} = useAsync<User|null>()
  // login 和register其实是一样的 只不过pointfree省略了参数
  // const login = (form:AuthForm) => auth.login(form).then(setUser)
  // const register = (form:AuthForm) => auth.register(form).then(user => setUser(user))
  // const logout = () => auth.logout().then(user => setUser(null))
  const dispatch:(...args:unknown[]) => Promise<User> = useDispatch()
  useMount(()=>{
    // bootstrapUser().then(setUser)
    run(dispatch(bootstrap()))
  })

  if(isIdle || isLoading){
    return <FullPageLoading/>
  }
  if(isError){
    return <FullPageErrorFallback error={error}/>
  }
  return (
    <div>
      {children}
    </div>
  )
}

export const useAuth = () => {
  const dispatch:(...args: unknown[]) => Promise<User>= useDispatch()
  const user = useSelector(selectUser)
  const login = useCallback((form: AuthForm) => dispatch(authStore.login(form)),[dispatch])
  const register = useCallback((form: AuthForm) => dispatch(authStore.register(form)),[dispatch])
  const logout = useCallback(() => dispatch(authStore.logout()),[dispatch])
  return {
    user,login,register,logout
  }
}