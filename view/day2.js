/**
 * Day 2
 * A weather app
 * Have trouble completing the animation part
 * will stçdy on the animation in later experiments
 */
'use strict';

import React,{ Component } from 'react';
import { Platform,Image,ScrollView,StatusBar,StyleSheet,Text,TouchableHighlight,View, TextInput} from 'react-native';
import Util from './utils';
import Icon from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';
import Storage from 'react-native-storage';

import {
    StackNavigator,
    TabNavigator
} from 'react-navigation';

class Weather extends Component{
  // static propTypes = {
  //   back: React.PropTypes.func.isRequired,
  // };

  constructor(props) {
    super(props)
    this.state = {
      //weather: weatherData,
      jsonData:null,
      city:null,
      newDate:[],
      // isSameCity:false,
    }
  }

  componentWillMount() {
    const city = this.state.city;
    const array = this.state.newDate;
    this.getMoviesFromApi(city, array);
  }

  getMoviesFromApi(city, array) {
    if (!city) {
      var url = "http://www.sojson.com/open/api/weather/json.shtml?city=苏州";
    } else {
      var url = "http://www.sojson.com/open/api/weather/json.shtml?city=" + this.state.city;
    }

    fetch(url)//请求地址  
            .then((response) => response.json())//取数据  
            .then((responseText) => {//处理数据  
                //通过setState()方法重新渲染界面
                if (!this.judgeCity(responseText, array)) {
                  if (responseText.status == 200){
                    this.setState({  
                      newDate:this.state.newDate.concat([
                        {
                          jsonData:responseText,
                        }
                      ])
                    })
                  } else {
                    alert("请输入正确的城市");
                  }
                } else {
                  alert("此城市的天气情况已经有了");
                }
              }).done();
  }

  judgeCity(responseText, array) {
    if (this.state.city == null ) {
      return false;
    } else {
      // for (var i in array) {
        var flg = false;
        array.map((elem,index)=>{
        // alert(responseText.city + "判断值");

        if (elem.jsonData.city == responseText.city) {
          flg = true;
        } 
        // else {
        //   alert('not same');
        //   return true;
        // }
      })
       // alert("flg" + flg)
        return flg;
    }
  }

  handleTextChange(addressText) {
    this.setState({
      city: addressText,
    })
  }

  render() {
      // for (var i in this.state.newDate) {
      //   alert('render城市：' + this.state.newDate[i].jsonData.city);
      //   // alert('当前输入的城市：' + responseText.city);
      // }
    const page = this.state.newDate.length == 0 ? <Text>Loading</Text>:this.state.newDate.map((newDateElem, newDateIndex) => {
      const today = !newDateElem ? <Text>Loading</Text> :newDateElem.jsonData.data;
      const date = !newDateElem ? <Text></Text> :newDateElem.jsonData.date;
      const city = !newDateElem ? <Text></Text> :newDateElem.jsonData.city;
      const slides = !newDateElem ? <Text></Text> :newDateElem.jsonData.data.forecast.map((elem, index) => {
        return (
          <View key={index}>
            <Text>日期：{elem.date}</Text>
            <Text>日出：{elem.sunrise}</Text>
            <Text>最高温度：{elem.high}{elem.low}</Text>
            <Text>最低温度：{elem.low}</Text>
            <Text>日落：{elem.sunset}</Text>
            <Text>风向：{elem.fx}{elem.fl}</Text>
            <Text>风速：{elem.fl}</Text>
            <Text>天气状况：{elem.type}</Text>
            <Text style={{marginBottom:10}} >生活小贴士：{elem.notice}</Text>
          </View>
          )
      });
      return (
        <View style={{flex:1}} key={newDateIndex}>
              <View style={{alignItems: 'center'}}>
                <Text style ={{fontSize: 25, marginTop:3}}>定位：{city}</Text>
                <Text>日期：{date}</Text>
                <Text>温度：{today.wendu}°C</Text>
                <Text>湿度：{today.shidu}</Text>
                <Text>空气质量：{today.quality}</Text>
              </View>
              <View>{slides}</View>
        </View>
      )
    });
///
    return (
      <ScrollView>
        <View>
            <TextInput onChangeText={(text) => this.handleTextChange(text)}></TextInput>
            <TouchableHighlight onPress={() => this.getMoviesFromApi(this.state.city, this.state.newDate)}><Text>添加城市+</Text></TouchableHighlight>
        </View>

        <View style={{width: Util.size.width, height: Util.size.height}}>
           <Swiper 
            showsButtons={false}
            paginationStyle={{bottom:10, paddingTop:10, borderTopColor:"rgba(255,255,255,0.7)",borderTopWidth:Util.pixel}}
            dot={<View style={{backgroundColor: 'rgba(255,255,255,0.2)', width: 6, height: 6, borderRadius: 3, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
            activeDot={<View style={{backgroundColor: 'rgba(255,255,255,0.5)', width: 6, height: 6, borderRadius: 3, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}>
                    {page}
            </Swiper>
        </View>
      </ScrollView>
    )
  }
}



      /*const hourView = elem.hours.map((hourElem, hourIndex) => {
        return (
          <View key={hourElem.key} style={styles.withinDayHoursBox}>
                  <Text style={hourIndex==0? styles.withinDayHoursTimeBold:styles.withinDayHoursTime}>{hourElem.time}</Text>
                  <Icon name={hourElem.icon} size={25} style={[styles.withinDayHoursIcon,{color:hourElem.color}]}></Icon>
                  <Text style={hourIndex==0? styles.withinDayHoursDegreeBold:styles.withinDayHoursDegree}>{hourElem.degree}</Text>
                </View>
        );
      });

      const dayView = elem.days.map((dayElem, dayIndex) => {
        return (
          <View key={dayElem.key} style={styles.withinWeekLine}>
            <View style={styles.withinWeekDay}>
              <Text style={styles.withinWeekDayText}>{dayElem.day}</Text>
            </View>
            <View style={styles.withinWeekIcon}>
              <Icon name={dayElem.icon}  style={styles.withinWeekIconIcon} size={25}></Icon>
            </View>
            <View style={styles.withinWeekDegree}>
              <Text style={styles.withinWeekHigh}>{dayElem.high}</Text>
              <Text style={elem.night?styles.withinWeekLowNight:styles.withinWeekLow}>{dayElem.low}</Text>
            </View>
          </View>
        );
      });

      return (
        <View key={elem.key}>
          <Image style={styles.image} source={elem.bg}></Image>
          <ScrollView style={styles.pageContainer}  showsVerticalScrollIndicator={false}>
            <View style={styles.headInfo}>
              <Text style={styles.city}>{elem.city}</Text>
              <Text style={styles.abs}>{elem.abs}</Text>
              <Text style={styles.degree}>{elem.degree}</Text>
              <Text style={styles.circle}>°</Text>
            </View>
            <View style={styles.withinDay}>
              <View style={styles.withinDayGeneral}>
                <View style={styles.withinDayHead}>
                  <Text style={styles.withinDayWeek}>{elem.today.week}</Text>
                  <Text style={styles.withinDayDay}>{elem.today.day}</Text>
                </View>
                <View style={styles.withinDayTail}>
                  <Text style={styles.withinDayHigh}>{elem.today.high}</Text>
                  <Text style={elem.night?styles.withinDayLowNight:styles.withinDayLow}>{elem.today.low}</Text>
                </View>
              </View>
              <ScrollView  horizontal={true} showsHorizontalScrollIndicator={false} style={styles.withinDayHoursContainer}> 
                <View style={styles.withinDayHours}>
                  {hourView}
                </View>
            </ScrollView>
            <View style={styles.withinWeek}>
              {dayView}
            </View>
            <View style={styles.weatherInfo}>
              <Text style={styles.weatherInfoText}>{elem.info}</Text>
            </View>
            <View style={styles.weatherOther}>
              <View style={styles.weatherOtherSection}>
                <View style={styles.weatherOtherLine}>
                  <Text style={styles.weatherOtherTitle}>日出：</Text>
                  <Text style={styles.weatherOtherValue}>{elem.rise}</Text>
                </View>
                <View style={styles.weatherOtherLine}>
                  <Text style={styles.weatherOtherTitle}>日落：</Text>
                  <Text style={styles.weatherOtherValue}>{elem.down}</Text>
                </View>
              </View>
              <View style={styles.weatherOtherSection}>
                <View style={styles.weatherOtherLine}>
                  <Text style={styles.weatherOtherTitle}>降雨概率：</Text>
                  <Text style={styles.weatherOtherValue}>{elem.prop}</Text>
                </View>
                <View style={styles.weatherOtherLine}>
                  <Text style={styles.weatherOtherTitle}>湿度：</Text>
                  <Text style={styles.weatherOtherValue}>{elem.humi}</Text>
                </View>
              </View>
              <View style={styles.weatherOtherSection}>
                <View style={styles.weatherOtherLine}>
                  <Text style={styles.weatherOtherTitle}>风速：</Text>
                  <Text style={styles.weatherOtherValue}><Text style={{fontSize:10}}>{elem.dir}</Text>{elem.speed}</Text>
                </View>
                <View style={styles.weatherOtherLine}>
                  <Text style={styles.weatherOtherTitle}>体感温度：</Text>
                  <Text style={styles.weatherOtherValue}>{elem.feel}</Text>
                </View>
              </View>
              <View style={styles.weatherOtherSection}>
                <View style={styles.weatherOtherLine}>
                  <Text style={styles.weatherOtherTitle}>降水量：</Text>
                  <Text style={styles.weatherOtherValue}>{elem.rain}</Text>
                </View>
                <View style={styles.weatherOtherLine}>
                  <Text style={styles.weatherOtherTitle}>气压：</Text>
                  <Text style={styles.weatherOtherValue}>{elem.pres}</Text>
                </View>
              </View>
              <View style={styles.weatherOtherSection}>
                <View style={styles.weatherOtherLine}>
                  <Text style={styles.weatherOtherTitle}>能见度：</Text>
                  <Text style={styles.weatherOtherValue}>{elem.sight}</Text>
                </View>
                <View style={styles.weatherOtherLine}>
                  <Text style={styles.weatherOtherTitle}>紫外线指数：</Text>
                  <Text style={styles.weatherOtherValue}>{elem.uv}</Text>
                </View>
              </View>
            </View>
            </View>
          </ScrollView>
        </View>
      );
    });

    // 

    return(
      <View style={{width: Util.size.width, height:Util.size.height}}>
      <Text>{this.props.param}</Text>
        <Swiper style={styles.wrapper}
        showsButtons={false}
        paginationStyle={{bottom:10, paddingTop:10, borderTopColor:"rgba(255,255,255,0.7)",borderTopWidth:Util.pixel}}
        dot={<View style={{backgroundColor: 'rgba(255,255,255,0.2)', width: 6, height: 6, borderRadius: 3, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
        activeDot={<View style={{backgroundColor: 'rgba(255,255,255,0.5)', width: 6, height: 6, borderRadius: 3, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}>
                {slides}
        </Swiper>
        <TouchableHighlight style={styles.backBtn}>
          <Icon size={20} name="ios-list-outline" style={styles.backBtnIcon}></Icon>
        </TouchableHighlight>
      </View>
    )*/
  // }
// }

export default class extends Component{
  render() {
    const {params} = this.props.navigation.state;
    return(
      <View style={styles.weatherContainer}>
        <Weather param={params.title}></Weather>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:2,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  pageContainer:{
    backgroundColor:"transparent",
    position: "absolute",
    width: Util.size.width,
    left:0,
    top: 20,
    height: Util.size.height - 53
  },
  headInfo:{
    paddingTop:70,
    alignItems:"center",
    paddingBottom:60,
  },
  city:{
    fontSize: 25,
    color:"#fff",
    paddingBottom: 5,
    backgroundColor:"transparent",
  },
  abs:{
    fontSize:15,
    color:"#fff",
    backgroundColor:"transparent"
  },
  degree:{
    fontSize:85,
    color:"#fff",
    fontWeight: "100",
  },
  circle:{
    fontSize:35,
    color:"#fff",
    fontWeight: "300",
    position:"absolute",
    top:130,
    right:Util.size.width/2-55,
  },
  withinDayGeneral:{
    flexDirection:"row",
    width: Util.size.width,
  },
  withinDayHead:{
    flex:1,
    flexDirection:"row",
    justifyContent: 'flex-start',
    paddingLeft: 20,
  },
  withinDayTail:{
    flex:1,
    flexDirection:"row",
    justifyContent: 'flex-end',
    paddingRight: 10,
  },
  withinDayWeek:{
    fontSize:15,
    color: "#fff",
    fontWeight: "400",
    width:50,
  },
  withinDayDay:{
    fontSize:15,
    color: "#fff",
    fontWeight: "300",
    width:50,
  },
  withinDayHigh:{
    fontSize:16,
    color: "#fff",
    fontWeight: "200",
    width:30,
  },
  withinDayLow:{
    fontSize:16,
    color: "#eee",
    fontWeight: "200",
    width:30,
  },
  withinDayLowNight:{
    fontSize:16,
    color: "#aaa",
    fontWeight: "200",
    width:30,
  },
  withinDayHoursBox:{
    width:55,
  },
  withinDayHoursContainer:{
    marginTop:3,
    borderTopColor:"rgba(255,255,255,0.7)",borderTopWidth:Util.pixel,
    borderBottomColor:"rgba(255,255,255,0.7)",borderBottomWidth:Util.pixel
  },
  withinDayHours:{
    paddingLeft:7,paddingTop:10,paddingBottom:10,paddingRight:10,
    flexDirection:"row",
    flexWrap:"nowrap"
  },
  withinDayHoursTime:{
    color:"#fff",
    fontSize:12,
    textAlign:"center"
  },
  withinDayHoursTimeBold:{
    color:"#fff",
    fontSize:13,
    textAlign:"center",   
    fontWeight:"500",
  },
  withinDayHoursIcon:{
    textAlign:"center",
    paddingTop:5,
  },
  withinDayHoursDegree:{
    color:"#fff",
    fontSize:14,
    paddingTop:5,
    textAlign:"center"
  },
  withinDayHoursDegreeBold:{
    color:"#fff",
    fontSize:15,
    textAlign:"center",
    paddingTop:5,
    fontWeight:"500"
  },
  withinWeek:{
    paddingTop:5
  },
  withinWeekLine:{
    flexDirection:"row",
    height: 28
  },
  withinWeekDay:{
    justifyContent:"center",
    alignItems:"flex-start",
    flex:1,
  },
  withinWeekIcon:{
    justifyContent:"center",
    alignItems:"center",
    flex:1, 
  },
  withinWeekDegree:{
    justifyContent:"flex-end",
    alignItems:"center",
    flex:1,
    flexDirection:"row",
    paddingRight:25,
  },
  withinWeekHigh:{
    color:"#fff",
    width:35,
    fontSize:16,
    textAlign:"right"
  },
  withinWeekIconIcon:{
    color:"#fff"
  },
  withinWeekLow:{
    color:"#eee",
    width:35,
    fontSize:16,
    textAlign:"right"
  },
  withinWeekLowNight:{
    color:"#aaa",
    width:35,
    fontSize:16,
    textAlign:"right"
  },
  withinWeekDayText:{
    color:"#fff",
    paddingLeft:20,
    fontSize:15,
  },
  weatherInfo:{
    marginTop:5,
    borderTopColor:"rgba(255,255,255,0.7)", borderTopWidth:Util.pixel,
    borderBottomColor:"rgba(255,255,255,0.7)", borderBottomWidth:Util.pixel
  },
  weatherInfoText:{
    color:"#fff",
    fontSize:15,
    paddingTop:10,paddingLeft:20,paddingBottom:10,paddingRight:20,
  },
  weatherOther:{
    paddingTop:10
  },
  weatherOtherSection:{
    paddingBottom:10
  },
  weatherOtherLine:{
    flexDirection:"row",
    flexWrap:"nowrap"
  },
  weatherOtherTitle:{
    width: Util.size.width/2-15,
    color:"#fff",
    textAlign:"right",
    fontSize: 15,
  },
  weatherOtherValue:{
    width: Util.size.width/2,
    paddingLeft:15,
    flex:1,
    fontSize: 15,
    color:"#fff",
  },
  backBtn:{
    position:"absolute", 
    right:20,bottom:7,
  },
  backBtnIcon:{
    color:"green",
    width:60,
    height:80
  },
})
