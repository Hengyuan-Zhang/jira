import { useCallback, useEffect } from "react";
import { cleanObject } from ".";
import { Project } from "../screens/project-list/list";
import { useHttp } from "./http";
import { useAsync } from "./useAsync";


// 获取项目列表
export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp()
  const { run, ...result} = useAsync<Project[]>()
  const fetchProjects = useCallback(() => client('projects',{data:cleanObject(param || {})}),[client, param])
  useEffect(() => {
    run(fetchProjects(),{
      retry:fetchProjects
    })
  }, [param,run,fetchProjects]);

  return result
}

// 列表的编辑
export const useEditProject = () => {
  const {run, ...asyncResult} = useAsync()
  const client = useHttp()
  const mutate = (params: Partial<Project>) => {
    return run(client(`projects/${params.id}`,{
      data:params,
      method:'PATCH'
    }))
  }
  return {
    mutate,
    ...asyncResult
  }
  //为什么要return 因为hooks智能用在最上层，这样只需要调用hook返回的方法
}

// 列表的增加
export const useAddProject = () => {
  const {run, ...asyncResult} = useAsync()
  const client = useHttp()
  const mutate = (params: Partial<Project>) => {
    return run(client(`projects/${params.id}`,{
      data:params,
      method:'POST'
    }))
  }
  return {
    mutate,
    ...asyncResult
  }
}

