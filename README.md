# Basic Messageing App
A simple messaging app to try out react native

## How To Run
I mostly followed the getting started docs. I tried to setup the rc's to cover bases.
I verified this only on macOS for an iOS simulator.

> clone

I have the repo set to private.

> cd SleeperTest

From in one window:
> ./SleeperTest: yarn react-native start
In another:
> ./SleeperTest yarn react-native run-ios

This also depends on cocoapods. See https://reactnative.dev/docs/environment-setup
You should just need to run:
> ./SleeperTest/ios: pod install.
## Requirements:
* Random messages continously show up.
* Username, avatar and date are shown at the start of each message group.
* User can send gif messages from the giphy trending api.
* Send message shows dummy avatar, username, sent timestamp.

## Limitations
* Form over function. This is where I would take the MVP to a designer. Tried to keep everything under 10 hours.
* Getting react native setup, fought zustand/immer/subscribe & sectionview.
* Just made a bare minimum home screen.
* Message sends are only stored locally.
* Scroll behavior: If you scroll up, the scroll is paused, if you scroll down you get 'auto scroll' behavior.
* I only validated left to right, light mode, ios, english with no localization. A full app would use IntlShape & RTL aware flex/margin settings. You would also have switches for all of your colors/icons based on light/dark mode in a global css file.


# Dependencies
## Reselect 
https://github.com/reduxjs/reselect 

Little optimization for selectors. It memo'izes the result of the input selectors and stores the calculated output. 
This saved from having to add memo on your selectors 


## Immer 
https://immerjs.github.io/immer/ 

Deep updates are a breeze. See updating the map of messages 


## Zustand 

https://github.com/pmndrs/zustand 

Store I'm familiar with. Has easy subscribe (new message comes in, show it on screen via hook) 

## Giphy React Native 

https://github.com/Giphy/giphy-react-native-sdk 

 
## RN Section List Get Item
Modified from https://github.com/jsoendermann/rn-section-list-get-item-layout/blob/master/index.ts 
This hasn't been updated for the newest react so I made a type specific version.

 
