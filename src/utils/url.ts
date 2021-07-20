import { cleanObject } from './index';
import { useMemo } from "react"
import { URLSearchParamsInit, useSearchParams } from "react-router-dom"

// 返回页面url中，指定键的参数值
export const useUrlQueryParam = <K extends string>(keys: K[]) =>{
  const [searchParams, setSearchParams] = useSearchParams()
  return [
    useMemo(
      ()=>
      keys.reduce((prev, key)=>{
        return{...prev, [key]:searchParams.get(key) || ''}
      },{} as {[key in K]:string}),
      // 为什么可以把searchParams安心的放在dependency数组里，因为这个变量是useSearchParams创建来的，类似useState,不会===判断
      // 但是keys不能作为dependency 会造成无限循环 把keys放进useState能解决这个问题
      [searchParams]
    ),
    (params: Partial<{[key in K]: unknown}>) => {
      const o = cleanObject({...Object.fromEntries(searchParams), ...params}) as URLSearchParamsInit
      return setSearchParams(o)
    }
  ] as const
  // 造成无限渲染的罪魁祸首，return出去的第一项对象引用地址一直在变
}