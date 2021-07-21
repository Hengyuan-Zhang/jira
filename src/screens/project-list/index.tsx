import { useState, useEffect } from "react";
import { List, Project } from "./list";
import { SearchPanel } from "./serach-panel";
import { cleanObject, useDebounce, useDocumentTitle, useMount } from "../../utils";
// import { useHttp } from "../../utils/http";
import styled from "@emotion/styled";
import { Button, Typography } from "antd";
// import { useAsync } from "../../utils/useAsync";
import { useProjects } from "../../utils/project";
import { useUsers } from "../../utils/user";
import { useUrlQueryParam } from "../../utils/url";
import { useProjectsSearchParams } from "./util";
import { ButtonNoPadding, Row } from "../../components/lib";
import { projectListActions } from "./project-list.slice";
import { useDispatch } from "react-redux";

export const ProjectListScreen = (props:{projectButton:JSX.Element}) => {
  useDocumentTitle('项目列表',false)
  // const [param, setParam] = useState({ name: "", personId: "" });
  // const [list, setList] = useState([]);
  // const [users, setUsers] = useState([]);
  // const [keys] = useState<('name'|'personId')[]>(['name','personId'])
  /**
   * const [param,setParam] = useUrlQueryParam(['name','personId'])
      const projectsParam = {...param, personId:Number(param.personId) || undefined}
   */
  // 因为直接一个keys传给useUrlQueryParam作为依赖会无限渲染，所以放到useState里面
  const [param, setParam] = useProjectsSearchParams()
  // const client = useHttp()
  const {isLoading, error, data:list, retry} = useProjects(useDebounce(param,200))
  const {data:users} = useUsers()
  const dispatch = useDispatch()
  
  return (
    <Container>
      <Row between={true}>
        <h1>项目列表</h1>
        <ButtonNoPadding
          type={'primary'}
          onClick={() => dispatch(projectListActions.openProjectModal())}
        >
          创建项目
        </ButtonNoPadding>
      </Row>
      <SearchPanel param={param} setParam={setParam} users={users||[]} />
      {error? <Typography.Text type={'danger'}>{error.message}</Typography.Text> : null}
      <List  projectButton={props.projectButton} refresh={retry} loading={isLoading} users={users||[]} dataSource={list || []}/>
    </Container>
  );
};


ProjectListScreen.whyDidYouRender = false
const Container = styled.div`
padding:3.2rem
`
