import React, { ReactNode, useState } from "react";
import * as auth from '../auth-provider'
import { FullPageLoading, FullPageErrorFallback } from "../components/lib";
import { User } from "../screens/project-list/serach-panel";
import { useMount } from "../utils";
import { http } from "../utils/http";
import { useAsync } from "../utils/useAsync";

interface AuthForm {
  username:string;
  password:string
}

const bootstrapUser = async() => {
  let user = null
  const token = auth.getToken()
  if(token){
    const data = await http('me',{token})
    user = data.user
  }
  return user
}

const AuthContext = React.createContext<{
  user:User|null,
  register:(form:AuthForm)=> Promise<void>,
  login:(form:AuthForm)=> Promise<void>,
  logout:()=> Promise<void>,
}|undefined>(undefined)
AuthContext.displayName = 'AuthContext'

export const AuthProvider = ({children}:{children:ReactNode}) => {
  // const [user, setUser] = useState<User|null>(null)
  const {data:user, error, isLoading, isIdle, isError, run, setData:setUser} = useAsync<User|null>()
  // login 和register其实是一样的 只不过pointfree省略了参数
  const login = (form:AuthForm) => auth.login(form).then(setUser)
  const register = (form:AuthForm) => auth.register(form).then(user => setUser(user))
  const logout = () => auth.logout().then(user => setUser(null))

  useMount(()=>{
    // bootstrapUser().then(setUser)
    run(bootstrapUser())
  })

  if(isIdle || isLoading){
    return <FullPageLoading/>
  }
  if(isError){
    return <FullPageErrorFallback error={error}/>
  }
  return <AuthContext.Provider value={{user, login, register, logout}}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if(!context){
    throw new Error('useAuth必须在Provider中使用')
  }
  return context
}