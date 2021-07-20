import { useCallback, useReducer, useState } from "react"
import { useMountedRef } from "."

interface State<D>{
  error: Error | null;
  data: D | null;
  stat: 'idle' | 'loading' | 'error' | 'success'
}

const defaultInitialState:State<null> = {
  stat:'idle',
  data:null,
  error:null
}

const defaultConfig = {
  throwOnError: false
}

const useSafeDispatch = <T>(dispatch:(...args:T[])=>void)=>{
  const mountedRef = useMountedRef()
  return useCallback((...args:T[])=>(mountedRef.current? dispatch(...args):void 0),[dispatch,mountedRef])
}

export const useAsync = <D>(initialState?:State<D>, initialConfig?:typeof defaultConfig) => {
  const config = {...defaultConfig, ...initialConfig}
  const [state, dispatch] = useReducer((state:State<D>, action:Partial<State<D>>)=>({...state, ...action}),{
    ...defaultInitialState,
    ...initialState
  })

  const safeDispatch = useSafeDispatch(dispatch) //阻止在已卸载页面上赋值

  // useState直接传入函数的含义是惰性初始化，所以要用useState保存函数，不能直接传入函数
  const [retry, setRetry] = useState(()=>()=>{})
  const setData = useCallback((data:D) => safeDispatch({
    data,
    stat:'success',
    error:null
  }),[safeDispatch])
  const setError = useCallback( (error: Error) => safeDispatch({
    data:null,
    stat:'error',
    error,
  }),[safeDispatch])

  // run用来触发异步请求
  const run = useCallback((promise: Promise<D>, runConfig?: {retry: () => Promise<D>}) => {
    if(!promise || !promise.then){
      throw new Error('请传入Promise类型数据')
    }
    setRetry(()=>()=>{
      if(runConfig?.retry){
        run(runConfig?.retry(),runConfig)
      }
    })
    // setState( preState =>({...preState,stat:'loading'})) //setState的另一种用法函数式，解决循环依赖问题
    safeDispatch({stat:'loading'})
    return promise.then(data =>{
      
        setData(data)
      
      return data
    }).catch(error => {
      setError(error)
      if(config.throwOnError){
        return Promise.reject(error)
      }
      return error
    })
  },[config.throwOnError, setData, setError, safeDispatch])

  return {
    isIdle:state.stat === 'idle',
    isLoading: state.stat === 'loading',
    isError: state.stat === 'error',
    isSuccess: state.stat === 'success',
    run,
    setData,
    setError,
    // retry被调用时重新跑一边run 让state刷新一遍
    retry,
    ...state
  }
}