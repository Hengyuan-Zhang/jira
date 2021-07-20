import { useState, useEffect, useRef } from "react";
export const isFalsy = (value: unknown) => (value === 0 ? false : !value);
export const isVoid = (value:unknown) => value === undefined || value === null || value === ''
export const cleanObject = (object: {[key:string]: unknown}) => {
  const result = { ...object };
  Object.keys(result).forEach((key) => {
    const value = result[key];
    if (isVoid(value)) {
      delete result[key];
    }
  });
  return result;
};

export const useMount = (callback:()=>void) => {
  useEffect(() => {
    callback();
  }, []);
};

export const useDebounce = <V>(value: V, delay?:number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(timeout); //在上一次useEffect执行完才会执行
  }, [value, delay]);
  return debouncedValue;
};

export const useDocumentTitle = (title:string, keepOnUnmount = true) => {
  const oldTitle = useRef(document.title).current //useRef持久化变量  避免闭包问题
  useEffect(()=>{
    document.title=title
  },[title])
  useEffect(()=>{
    return ()=>{
      if(!keepOnUnmount){
        document.title = oldTitle
      }
    }
  },[keepOnUnmount, oldTitle])
}

export const resetRoute = () => window.location.href = window.location.origin

/**
 * 返回组件的挂载状态，如果还没挂载或者已经卸载返回false;反之返回true
 */
export const useMountedRef = () => {
  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false
    }
  })

  return mountedRef
}