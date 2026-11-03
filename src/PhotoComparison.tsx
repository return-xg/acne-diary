import React,{memo,useEffect,useRef,useState} from 'react';
import {Animated,Image,PanResponder,StyleSheet,View} from 'react-native';

type Props={before:string;after:string;onDraggingChange:(dragging:boolean)=>void};
function PhotoComparison({before,after,onDraggingChange}:Props){
 const [width,setWidth]=useState(0);
 const position=useRef(new Animated.Value(0)).current;
 const geometry=useRef({width:0,left:0,ratio:0.5});
 const callback=useRef(onDraggingChange);callback.current=onDraggingChange;
 const update=(x:number)=>{
  const g=geometry.current;
  const next=Math.max(0,Math.min(g.width,x));
  g.ratio=g.width?next/g.width:0.5;
  position.setValue(next);
 };
 const responder=useRef(PanResponder.create({
  onStartShouldSetPanResponder:()=>true,
  onStartShouldSetPanResponderCapture:()=>true,
  onMoveShouldSetPanResponder:()=>true,
  onPanResponderGrant:event=>{
   // Children ignore touches, so locationX is always relative to this surface.
   geometry.current.left=event.nativeEvent.pageX-event.nativeEvent.locationX;
   callback.current(true);
   update(event.nativeEvent.locationX);
  },
  onPanResponderMove:(_event,gesture)=>update(gesture.moveX-geometry.current.left),
  onPanResponderTerminationRequest:()=>false,
  onShouldBlockNativeResponder:()=>true,
  onPanResponderRelease:()=>callback.current(false),
  onPanResponderTerminate:()=>callback.current(false),
 })).current;
 useEffect(()=>()=>callback.current(false),[]);
 return <View accessibilityLabel="原图滑动对比，左右拖动查看差异" style={s.surface} {...responder.panHandlers} onLayout={event=>{
  const next=event.nativeEvent.layout.width;
  geometry.current.width=next;setWidth(next);position.setValue(next*geometry.current.ratio);
 }}>
  <View pointerEvents="none" style={StyleSheet.absoluteFill}><Image style={StyleSheet.absoluteFill} resizeMode="contain" source={{uri:after}}/></View>
  <Animated.View pointerEvents="none" style={[s.clip,{width:position}]}>
   <Image style={{width,height:320}} resizeMode="contain" source={{uri:before}}/>
  </Animated.View>
  <Animated.View pointerEvents="none" style={[s.divider,{transform:[{translateX:Animated.subtract(position,1)}]}]}/>
 </View>;
}
export default memo(PhotoComparison);
const s=StyleSheet.create({surface:{height:320,backgroundColor:'#DADED5',overflow:'hidden',borderRadius:12},clip:{position:'absolute',left:0,top:0,height:320,overflow:'hidden'},divider:{position:'absolute',left:0,top:0,bottom:0,width:2,backgroundColor:'#FFFFFF'}});
