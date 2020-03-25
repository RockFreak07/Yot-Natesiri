import React,{Component} from "react";
import { Layout, Menu, Breadcrumb,Button,Table } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  HomeOutlined,
} from '@ant-design/icons';

import {Link} from "react-router-dom"
import { Input ,Cascader} from 'antd';
import {parse} from "mathjs";
import axios from 'axios';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class Newton extends Component{

    state = {
        collapsed: false,
      };
    
      onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
      };
      constructor(props)
    {
        super(props);
        this.state={
            options:[],
            diffs:[],
            Eq:null,
            EqDiff:null,
            Xinitial:null,
            result:null,
            dataTable:[],
            checked:false,
            eqtotal:[],
        }
    }

      componentDidMount()
      {
          
           axios.get('http://localhost:8080/newton.php')
          // axios.get('http://localhost/numer/server/newton.php')
          .then(res=>{
              console.log(res.data);
              this.setState({
                eqtotal:res.data
              })
              let item =[];
              let optionsArr = [];
              let optionsDiffArr = [];
              res.data.map(dataMap=>{
                let optionsObj = {};
                let optionsDiff = {};
                  if(dataMap.t_type=="newton")
                  {
                      item = item.concat(dataMap.n_name);
                      optionsObj.value = dataMap.n_name;
                      optionsObj.label = dataMap.n_name;
                      optionsDiff.value = dataMap._dif;
                      optionsDiff.label = dataMap._dif;
                      optionsArr.push(optionsObj);
                      optionsDiffArr.push(optionsDiff);
                      console.log(optionsObj);
                      console.log(optionsDiff);
                  }
              })
              this.setState({
                  options:optionsArr,
                  diffs:optionsDiffArr
              })
          })
      }
      Equet = (EqForSloveFuntion,xvalueforSlove) => {
        const NodeEqua = parse(EqForSloveFuntion); 
        const Equa = NodeEqua.compile();
        let scope = {
            x:xvalueforSlove
        }
        return Equa.eval(scope);
    }
    err = (xmold, xmnew) => {
        var er = ((Math.abs((xmnew - xmold) / xmnew)) * 100) / 100;
        return er;
    }
    getValue = () => {
        
        const {Eq,EqDiff,Xinitial} = this.state;
        console.log(Xinitial);
        var xi_inmain  = parseFloat(Xinitial); 
        let tableArrData = [];
        
        var xiplus1_inmain;
        var fxi;
        var fxpi;
        var fixerrorValue = 0.0001;
        var errorValue = 1;
        var i=0;
    while(errorValue>=fixerrorValue)
    {
        fxi=this.Equet(Eq,xi_inmain);
        fxpi=this.Equet(EqDiff,xi_inmain);
        xiplus1_inmain=xi_inmain-(fxi/fxpi);
        errorValue = this.err(xiplus1_inmain,xi_inmain);
        let tableObjData = {};
        tableObjData.index = i;
        tableObjData.xi_inmain = xi_inmain;
        tableObjData.errorValue = errorValue;
        tableArrData.push(tableObjData);
        console.log(xi_inmain,fxi,fxpi);
        console.log("XMVALUE = ", xiplus1_inmain);
        console.log("This is errorvalue = ", errorValue);
        console.log("This is fixvalueerror = ", fixerrorValue);
        xi_inmain=xiplus1_inmain;
        i++;
        }
        this.setState({
          dataTable:tableArrData,
          result:xiplus1_inmain
        })
    }   
    EquationNewton = () =>{
      const formData = new FormData();
      formData.append("n_name",this.state.Eq);
      formData.append("t_type","Newton");
      formData.append("_dif",this.state.EqDiff);
      const config = {
        headers: {
            "content-type": "multipart/form-data"
            }
        };
      
      axios.post('http://localhost:8080/add.php',formData,config)
      .then(res=>{
        console.log(res);
      })
      .catch(err=>{
         throw err 
      })
      this.myFunction()
    }
    showResult=()=>{
      const columns = [
        {
          title: 'No',
          dataIndex: 'index',
          key: 'index',
        },
        {
          title: 'X',
          dataIndex: 'xi_inmain',
          key: 'xi_inmain',
        },
        {
          title: 'Error',
          dataIndex: 'errorValue',
          key: 'errorValue',
        },
      ];
      if(this.state.result!==null)
      {
        return <div>
          <center><h5>This is Result of NewtonRaphson is : {this.state.result}</h5></center><br/>
          <Table dataSource={this.state.dataTable} columns={columns} rowKey="Index" style={{marginLeft:"5%" , marginRight:"5%" , background:"lightblue" }} size="middle"/>
        </div>
      }
    }
      onChange = (value) => {// Function
        console.log(value[0]);
        let diff;
        if(value[0]!==undefined){
          this.state.eqtotal.map(eqt=>{
            if(eqt.n_name===value[0]){
              diff=eqt._dif
            }
          })
          this.setState({
            Eq:value[0],
            checked:true,
            EqDiff:diff
    
          })
        }else{
          this.setState({
            Eq:value[0],
            checked:false
    
          })
        }
        
      }
      displayRender = (label) => {
        return label[label.length - 1];
      }
      onChange2 = (value) => {//Funtion Diff
        console.log(value[0]);
        this.setState({
          EqDiff:value[0]
        })
      }
      displayRender2 = (label) => {
        return label[label.length - 1];
      }
      onChangeSwitch1 = (checked) => {
        console.log(checked)
        this.setState({
          SwitchOpen:checked
        })
      }
      onChangeSwitch = (checked) => {
        console.log(checked)
        this.setState({
          SwitchOpen:checked
        })
      }
      showInput = () =>{
          return <center><p><Cascader
          options={this.state.options}
          expandTrigger="hover"
          displayRender={this.displayRender}
          onChange={this.onChange}
          style={{width:"13em" , marginLeft:"20%" , marginRight:"5%" , marginBottom:"0.5%"}}
          /></p></center>
        
      }
      showInput2 = () =>{
         if (this.state.checked){
         
          
            return <center>
              <Input placeholder="Input Equations" style={{width:"13em" , marginLeft:"7%" , marginRight:"5%" , marginBottom:"0.5%"}} defaultValue={this.state.EqDiff} onChange={e=>this.setState({EqDiff:e.target.value})}/>
            </center>
            // return <center><p><Cascader
            // options={this.state.diffs}
            // expandTrigger="hover"
            // displayRender={this.displayRender2}
            // onChange={this.onChange2}
            // defaultValue={['2x']}
            // style={{width:"13aem" , marginLeft:"7%" , marginRight:"5%" , marginBottom:"0.5%"}}
            // /></p></center>
          
         }
      }
      render() {
        return (
          
          <div>
                  <Layout>
          <Sider
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
      }}
    >
      <div className="logo" />
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>

        <Menu.Item key="0"><Link to="/"/>
          <HomeOutlined />
          <span className="nav-text">HOME</span>

        </Menu.Item>
        
        <SubMenu
          key="sub1"
          title={
            <span>
              <MailOutlined />
              <span>Root</span>
            </span>
          }
        >
            <Menu.Item key="1"><Link to="/Bisection"/>
                <UserOutlined />
                <span className="nav-text">Bisection</span>         
            </Menu.Item>
            <Menu.Item key="2"><Link to="/FalsePosition"/>
                <UserOutlined />
                <span className="nav-text">False Position</span>         
            </Menu.Item>
            <Menu.Item key="3"><Link to="/Onepoint"/>
                <UserOutlined />
                <span className="nav-text">One point</span>         
            </Menu.Item>
            <Menu.Item key="4"><Link to="/Newton"/>
                <UserOutlined />
                <span className="nav-text">Newton</span>  
            </Menu.Item>    
            <Menu.Item key="5"><Link to="/Secant"/>
                <UserOutlined />
                <span className="nav-text">Secant</span>               
            </Menu.Item>
        </SubMenu>


      </Menu>
    </Sider>
    
    <Layout className="site-layout" style={{ marginLeft: 200 }}>
      <Header className="site-layout-background" style={{ padding: 0 }} />
      <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
      <div className="box" style={{ padding: 24, minHeight: 500 }}>
                 
                 <div >
                   <center><h2>NEWTON</h2></center> 
                 </div>
                              
                           <div>                   
                        <center>   <Cascader options={this.state.options}expandTrigger="hover"displayRender={this.displayRender}onChange={this.onChange}/> </center>
           </div>
           <br></br>
           <div>
           <center><Input placeholder="Input" style={{width:"13em" , marginLeft:"7%" , marginRight:"5%" , marginBottom:"0.5%"}} onChange={e=>this.setState({Eq:e.target.value})}/>
           </center>
           </div>
                          <div> <center><Input placeholder="x" style={{width:300 ,  margin:20,marginLeft:400}} onChange={e=>this.setState({Xinitial:e.target.value})}/></center></div>
                           <center><Input placeholder="error" style={{width:300 ,  margin:20,marginLeft:400}} onChange={e=>this.setState({f:e.target.value})}/></center>
                         
                           <p>
                           
          <center> <Button onClick={this.getValue}>SUBMIT</Button> </center>
                        </p>
         <br/>
         {this.showResult()}
               </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>@Yot Natrsiri</Footer>
    </Layout>
  </Layout>,
  
        </div>
            )
      }
}
export default Newton;