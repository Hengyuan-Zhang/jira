import React, { ReactNode } from 'react'

type FallbackRender = (props: {error:Error | null}) => React.ReactElement
// export class ErrorBoundary extends React.Component<{children:ReactNode,fallbackRender:FallbackRender}>{
  
// }
export class ErrorBoundary extends React.Component<React.PropsWithChildren<{fallbackRender:FallbackRender}>,{error:Error|null}>{
  state = {error: null}
  static getDerivedStateFromError(error:Error){
    return {error} //当ErrorBoundary的子组件抛出异常时，error会覆盖state里的error
  }
  render(){
    const {error} = this.state
    const {fallbackRender,children} = this.props
    if(error){
      return fallbackRender({error})
    }
    return children
  }
}