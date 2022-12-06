import Vue from 'vue'
import Vuex from 'vuex'

import pipwerks, { SCORM } from 'pipwerks-scorm-api-wrapper'

// import our course content
import Content from '@/Content.json'
// read in the english version and parse it
const myObjStr = JSON.stringify(Content.en);
const content = JSON.parse(myObjStr);

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    bookmark: '',
    courseContent: content,
    languages: [''],
    languageLabels: [''],
    language: '',
    device: '',
    orientation: '',
    direction: 'next',
    lms: {
      scorm: pipwerks.SCORM,
      startTime: 0,
      endTime: 0,
    },
    popup: {
      show: false,
      title: null,
      body: ''
    },
    route: '/',
    tempbookmark: '',
    topics: [{ uri: '', title: '', text: '', _image: '', pages: [{ pageID: 0, locked: false, complete: false }], locked: false, complete: false, optional: false }],
    started: false,
    topic: 0,
    subtitles: false,
    showSubtitles: true,
    showSplash: true,
    showHelp: false,
    showLangSelect: false,
    showResources: false,
    showComplete: false,
    assessAttempts: 0,
    assessPassed: false,
    animMenuIcon: false,
    userCloseComplete: false,
    imagesLoaded: false
  },
  getters: {
    //----- LNAGUAGES --------//
    setLanguages: (state, getters) => {
      const myObjStr = JSON.stringify(Content);
      const allContent = JSON.parse(myObjStr);  
      Object.entries(allContent).forEach((entry, index) => {
        const [key] = entry;
        state.languages.push(`${key}`);
        const val = allContent[key]['label'];
        state.languageLabels.push(val);
      });
      if(state.languages.length === 2) {
        state.language = state.languages[1];
      }
      getters.write;
      // if(state.languages.length > 1) {
      //   state.showLangSelect = true;
      // }
    },
    updateLang: (state, getters) => {
      let myObjStr = JSON.stringify(Content.en);
      //what is the default lang?
      let newlang = state.courseContent.config.defaultlang;
      //is the default the same as thelnaguage saved?
      if(state.language !== newlang) {
        newlang = state.language;
      }
      //set the content for the lang being updated
      switch(newlang) {
        case 'de': 
          myObjStr = JSON.stringify(Content.de);
          break;
        case 'es': 
          myObjStr = JSON.stringify(Content.es);
          break;
        // case 'fr': 
        //   myObjStr = JSON.stringify(Content.fr);
        //   break;
      }
      const content = JSON.parse(myObjStr);
      state.courseContent = content;
      //set the lnaguge for next time
      state.language = newlang;
      // preload all images
      getters.preloadImages;
      //clear data and reload topics
      getters.clear;
      // save these settings
      getters.write;
    },
    getLangLabel: (state, getters) => (_index: number) => {
      const label = state.languageLabels[_index];
      return label;
    },
    
    //------- IMAGES ------//
    preloadImages: (state, getters) => {
      state.courseContent.topics.forEach((topic: any) => {
        // update to add in any loops, nodes that need to catch, depending on the components
        if (topic.pages) {
          topic.pages.forEach((page: any) => {
            if (page._image) {
              getters.loadImage(page._image);
            }
          });
        }
      });
    },
    loadImage: state => (_imgsrc: string) => {
      // load the image so it's in the cache
      const img = new Image();
      img.src = _imgsrc;
    },

    //------ CONTENT -------//
    setRoute: (state, getters) => (_uri: string) => {
      let bookmark: string = '';
      state.topics.forEach((topic: any) => {
        if (topic.uri === _uri && topic.pages) {
          state.route = _uri;
          if (state.direction === 'next') {
            bookmark = topic.pages[0].pageID;
          } else {
            bookmark = topic.pages[topic.pages.length - 1].pageID;
          }
          document.title = getters.getDocTitle(topic);
        }
      });
      getters.write;
      getters.setSCORMBookmark(bookmark);
    },
    setRouteScreen: (state, getters) => (_uri: string) => {
      state.topics.forEach((topic: any) => {
        if (topic.uri === _uri && topic.pages) {
          state.route = _uri;
          document.title = getters.getDocTitle(topic);
        }
      });
      getters.write;
    },
    getDocTitle: (state,getters) => (_topic: any) => {
      let coursename = state.courseContent.config.coursename;
          let title = _topic.title;
          coursename = coursename.replace('|','');
          title = title.replace('|','');
          return coursename + ' - ' + title;
    },
    setPages: (state, getters) => {
      state.topics = [];
      state.courseContent.topics.forEach((topic: any) => {
        let pagesArray: any = [];
        let pagesIndex = 0;
        if (topic.pages) {
          topic.pages.forEach((page: any) => {
            let pageComp = false;
            //if(page._component === 'media') {
              //pageComp = true;
            //}
            pagesArray.push({ pageID: page._id, locked: page._locked ? page._locked : false, complete: pageComp });
                pagesIndex++;
          });
          // topic.pages.forEach((page: any, index: number) => {
          //   state.courseContent.locked.forEach((component: any) => {
          //     if (page._component === component) {
          //       const arrayIndex = index + 1;
          //       pagesArray[arrayIndex].locked = true;
          //     }
          //   });
          // });
          const img = topic._image ? topic._image : '';
          state.topics.push({ uri: topic._uri, title: topic.title, text: topic.text, _image: img, pages: pagesArray, locked: topic._locked ? topic._locked : false, complete: false, optional: topic._optional });
        }
      });
      getters.write;
      
    },
    getTopicFooter: (state, getters) => {
      let topicData: any;
      // whole JSON data required
      state.courseContent.topics.forEach((topic: any) => {
        if (topic._uri === state.route) {
          topicData = topic._navigation;
        }
      });
      return topicData;
    },
    getPages: (state, getters) => {
      let pages: any[] = [];
      // whole JSON data required
      state.courseContent.topics.forEach((topic: any, tIndex: number) => {
        if (topic._uri === state.route) {
          pages = topic.pages;
        }
      });
      Vue.set(state, 'direction', 'next');
      getters.write;
      return pages;
    },
    getPagesHorizontal: (state, getters) => {
      let pages: any[] = [];
      let bookmark: string = '';
      // whole JSON data required
      state.courseContent.topics.forEach((topic: any, tIndex: number) => {
        if (topic._uri === state.route) {
          pages = topic.pages;
          if (state.courseContent.global._navigation !== 'navigation') {
            if (state.direction === 'next') {
              bookmark = topic.pages[0]._id;
            } else {
              bookmark = topic.pages[topic.pages.length - 1]._id;
            }
            getters.setSCORMBookmark(bookmark);
            getters.write;
          }
        }
      });
      return pages;
    },
    setContentStatus: (state, getters) => (_id: string, _info: string, _status: boolean) => {
      let unlockpage: number = -1;
      let topicnum: number = -1;
      let bookmark: string = '';
      //console.log('setContentStatus >> ' + _id);
      state.topics.forEach((topic: any, tIndex: number) => {
        if (topic.pages) {
          topic.pages.forEach((page: any, pIndex: number) => {
            if (page.pageID === _id) {
              switch (_info) {
                case 'complete':
                  //console.log(pIndex, 'complete');
                  Vue.set(state.topics[tIndex].pages[pIndex], 'complete', _status);
                  getters.checkTopicCompletion(topic.uri, tIndex);
                  bookmark = page.pageID;
                  break;
                case 'locked':
                  if (unlockpage === -1) {
                    if(pIndex < topic.pages.length-1) {
                      unlockpage = pIndex + 1;
                    }
                    topicnum = tIndex;
                  }
                  break;
              }
            }
            if (unlockpage === pIndex) {
              Vue.set(state.topics[topicnum].pages[pIndex], 'locked', _status);
              bookmark = page.pageID;
            }
          });
        }
      });
      if (state.courseContent.menu._type !== 'pages') {
        getters.setSCORMBookmark(bookmark);
      }
      getters.write;
    },
    setContentCompleteUnlockNext: (state, getters) => (_id: string, _el: Element) => {
      getters.setContentStatus(_id, 'locked', false);
      //console.log('setContentCompleteUnlockNext');
      if(getters.getContentStatus(_id, 'complete', true) === false) {
        setTimeout(() => {
          getters.animateMenuIcon;
        }, 5000);
      }
      getters.setContentStatus(_id, 'complete', true);  
      if (_el) {
          Vue.nextTick(function () {
          _el.scrollIntoView(true);
        })
      }
    },
    scrollToElement: (state, getters) => (elemChild: HTMLElement, _top: boolean) => {
      var elem = document.getElementById('app');
      if (elem && elemChild) {
        setTimeout(() => {
          elemChild.scrollIntoView(_top);
        }, 100);
      }
    },
    getContentStatus: state => (_id: string, _info: string) => {
      let status: boolean = false;
      let locked: boolean = false;
      state.topics.forEach((topic: any) => {
        if (topic.pages) {
          const opt: boolean = topic.optional;
          topic.pages.forEach((page: any) => {
            if (page.locked && state.courseContent.global._alllocked === true) {
              locked = true;
            }
            if (page.pageID === _id) {
              switch (_info) {
                case 'complete':
                  status = page.complete;
                  break;
                case 'locked':
                  status = page.locked;
                  if (locked === true) {
                    status = true;
                  }
                  break;
                case 'optional':
                  status = opt;
                  break;
              }
            }
          });
        }
      });
      return status;
    },
    checkTopicLocked: (state) => (_topic: string) => {
      let locked = false;
      state.topics.forEach((topic: any) => {
        if (topic.uri === _topic) {
          locked = topic.locked;
        }
      });
      return locked;
    },
    checkTopicCompletion: (state, getters) => (_topic: string, _index: number) => {
      let allcomplete = true;
      state.topics.forEach((topic: any) => {
        if (topic.uri === _topic) {
          // loop through pages to see if all complete
          if (topic.pages) {
            topic.pages.forEach((page: any, pIndex: number) => {
              if (page.complete === false) { // && pIndex !== topic.pages.length - 1
                allcomplete = false;
              }
            });
          }
        }
      });
      // if true, set as complete
      if (allcomplete) {
        Vue.set(state.topics[_index], 'complete', true);
        //check whether to unlock any topics
        state.courseContent.topics.forEach((topic: any, tIndex: number) => {
          if(topic._unlockedBy) {
            let unlockTopic = true;
            topic._unlockedBy.forEach((unlock: any) => {
              state.topics.forEach((t: any) => {
                if (t.uri === unlock) {
                 if (!getters.checkTopicComplete(t.uri)) {
                   unlockTopic = false;
                 }
                }
              });
            });
            if (unlockTopic) {
              Vue.set(state.topics[tIndex], 'locked', false);
            }
          }
        });
        // unlock any topics?
        if (state.courseContent.topics[_index]._unlocks) {
          state.courseContent.topics[_index]._unlocks.forEach((unlock: any) => {
            state.topics.forEach((topic: any, tIndex: number) => {
              if (topic.uri === unlock) {
                Vue.set(state.topics[tIndex], 'locked', false);
              }
            });
          });
        }
      }
      getters.write;
    },
    topicComplete: (state, getters) => {
      let complete = false;
      state.topics.forEach((topic: any) => {
        if (topic.uri === state.route) {
          complete = topic.complete;
        }
      });
      getters.checkCourseComplete;
      return complete;
    },
    topicOptional: (state, getters) => {
      let optional = false;
      state.topics.forEach((topic: any) => {
        if (topic.uri === state.route) {
          optional = topic.optional;
        }
      });
      return optional;
    },
    checkTopicComplete: (state, getters) => (_uri: string) =>{
      let complete = false;
      state.topics.forEach((topic: any) => {
        if (topic.uri === _uri) {
          complete = topic.complete;
        }
      });
      // getters.checkCourseComplete;
      return complete;
    },
    checkCourseComplete: (state, getters) => {
      let complete = true;
      state.topics.forEach((topic: any) => {
        if (topic.complete !== true && topic.optional === false) {
          complete = false;
          //console.log(topic, topic.complete, topic.optional);
        }
      });
      if (complete === true) {
        getters.setSCORMComplete;
        // if(getters.route === '/menu') {
        //   state.showComplete = true;
        // }
        getters.write;
      }
    },
    checkShowCourseComplete: (state, getters) => {
      let complete = true;
      state.topics.forEach((topic: any) => {
        if (topic.complete !== true && topic.optional === false) {
          complete = false;
          //console.log(topic, topic.complete, topic.optional);
        }
      });
      if (complete === true) {
        getters.setSCORMComplete;
        state.showComplete = true;
        getters.write;
      }
    },

    //------- CONTENT ------//
    showPopup: state => (_popupData: any) => {
      setTimeout(() => {
        state.popup.title = _popupData.title ? _popupData.title : null;
        state.popup.body = _popupData.body;
        state.popup.show = true;
      }, 100);
    },
    closePopup: (state, getters) => (_close: boolean) => {
      state.popup.show = false;
      state.popup.title = null;
      getters.write;
    },


    //------- NAVIGATE ------//
    getNewPageID: (state, getters) => (_nav: string) => {
      let pageNum: number = 0;
      let topicNum: number = -1;
      let pageID = '';
      // find the current page location
      state.topics.forEach((topic: any, tIndex: number) => {
        if (topic.pages) {
          topic.pages.forEach((page: any, pIndex: number) => {
            if (page.pageID === state.bookmark) {
              topicNum = tIndex;
              pageNum = pIndex;
            }
          });
        }
      });
      // navigate to 'found' page
      switch (_nav) {
        case 'prev':
          if (pageNum > 0) {
            state.topics.forEach((topic: any, tIndex: number) => {
              if (topic.pages) {
                if (topicNum === tIndex) {
                  topic.pages.forEach((page: any, pIndex: number) => {
                    if ((pageNum - 1) === pIndex) {
                      pageID = page.pageID;
                    }
                  });
                }
              }
            });
          }
          break;
        case 'next':
          state.topics.forEach((topic: any, tIndex: number) => {
            if (topic.pages && (pageNum < (topic.pages.length - 1))) {
              if (topicNum === tIndex) {
                topic.pages.forEach((page: any, pIndex: number) => {
                  if ((pageNum + 1) === pIndex) {
                    pageID = page.pageID;
                  }
                });
              }
            }
          });
          break;
        default:
          // to page by id
          pageID = _nav;
          break;
      }
      let uri = '';
      if (pageID === '') {
        if (getters.getPagePrevNext(_nav) === false) {
          //check next or prev topic
          state.topics.forEach((topic: any, tIndex: number) => {
            if (topic.pages) {
              // new vars
              let topicToCheck = topicNum + 1;
              let pageToCheck = 0;
              if (_nav === 'prev') {
                topicToCheck = topicNum - 1;
                pageToCheck = topic.pages.length - 1;
              }
              // find page id
              if (topicToCheck === tIndex) {
                uri = topic.uri;
                topic.pages.forEach((page: any, pIndex: number) => {
                  if (pageToCheck === pIndex) {
                    pageID = page.pageID;
                  }
                });
              }
            }
          });
          if (pageID !== '') {
            state.direction = _nav;
            Vue.set(state, 'direction', _nav);
            getters.write;
          }
        }
      }
      // set the bookmark to display the page
      if (pageID !== '') {
        getters.setSCORMBookmark(pageID);
        getters.write;
      }
      return uri;
    },
    getPrevPageID: state => (_id: string) => {
      let pageNum: number = 0;
      let topicNum: number = -1;
      let pageID = '';
      // find the current page location
      state.topics.forEach((topic: any, tIndex: number) => {
        if (topic.pages) {
          topic.pages.forEach((page: any, pIndex: number) => {
            if (page.pageID === _id) {
              topicNum = tIndex;
              pageNum = pIndex;
            }
          });
        }
      });
      // find prev page id
      state.topics.forEach((topic: any, tIndex: number) => {
        if (topic.pages && (pageNum < (topic.pages.length))) {
          if (topicNum === tIndex) {
            topic.pages.forEach((page: any, pIndex: number) => {
              if ((pageNum - 1) === pIndex) {
                pageID = page.pageID;
              }
            });
          }
        }
      });
      return pageID;
    },
    getNextPageID: state  => {
      let pageNum: number = 0;
      let topicNum: number = -1;
      let pageID = '';
      // find the current page location
      state.topics.forEach((topic: any, tIndex: number) => {
        if (topic.pages) {
          topic.pages.forEach((page: any, pIndex: number) => {
            if (page.pageID === state.bookmark) {
              topicNum = tIndex;
              pageNum = pIndex;
            }
          });
        }
      });
      // find next page id
      state.topics.forEach((topic: any, tIndex: number) => {
        if (topic.pages && (pageNum < (topic.pages.length - 1))) {
          if (topicNum === tIndex) {
            topic.pages.forEach((page: any, pIndex: number) => {
              if ((pageNum + 1) === pIndex) {
                pageID = page.pageID;
              }
            });
          }
        }
      });
      return pageID;
    },
    checkIfLastScreenInPage: (state, router) => (_id: string) => {
      let last = false;
      let pageNum: number = -1;
      let topicNum: number = -1;
      // find the current page location
      state.topics.forEach((topic: any, tIndex: number) => {
        if (topic.pages) {
          topic.pages.forEach((page: any, pIndex: number) => {
            if (page.pageID === _id) {
              pageNum = pIndex;
              topicNum = tIndex;
            }
          });
        }
      });
      //is the last page?
      state.topics.forEach((topic: any, tIndex: number) => {
        if(topicNum === tIndex) {
          //console.log(pageNum, topic.pages.length - 1);
          if (topic.pages && (pageNum === (topic.pages.length - 1))) {
            last = true;
          }
        }
      });
      //console.log('state.bookmark: ' + state.bookmark, 'pageNum: ' + pageNum, 'last: ' + last);
      return last;
    },
    getPagePrevNext: (state, router) => (_nav: string) => {
      let pageNum: number = 0;
      let topicNum: number = -1;
      let pageID = '';
      let allowpage = true;
      let locked = false;
      // find the current page location
      state.topics.forEach((topic: any, tIndex: number) => {
        if (topic.pages) {
          topic.pages.forEach((page: any, pIndex: number) => {
            if (page.pageID === state.bookmark) {
              topicNum = tIndex;
              pageNum = pIndex;
            }
          });
        }
      });
      // find next or prev page id
      state.topics.forEach((topic: any, tIndex: number) => {
        if (topic.pages) {
          if (topicNum === tIndex) {
            topic.pages.forEach((page: any, pIndex: number) => {
              if (_nav === 'next') {
                if ((pageNum + 1) === pIndex && (pageNum < topic.pages.length)) {
                  if (page.locked === true) {
                    locked = true;
                  }
                  if (locked === false) {
                    pageID = page.pageID;
                  }
                }
              } else {
                if ((pageNum - 1) === pIndex && (pageNum > 0)) {
                  if (page.locked === true) {
                    locked = true;
                  }
                  if (locked === false) {
                    pageID = page.pageID;
                  }
                }
              }
            });
          }
        }
      });
      // if no value found
      if (pageID === '') {
        allowpage = false;
      }
      return allowpage;
    },
    getPageFirstLast: state => (_nav: string) => {
      let pageNum: number = 0;
      let topicNum: number = -1;
      let firstlastPage = false;
      // find the current page location
      state.topics.forEach((topic: any, tIndex: number) => {
        if (topic.pages) {
          topic.pages.forEach((page: any, pIndex: number) => {
            if (page.pageID === state.bookmark) {
              topicNum = tIndex;
              pageNum = pIndex;
            }
          });
        }
      });
      // check ...
      state.topics.forEach((topic: any, tIndex: number) => {
        if (topic.pages) {
          if (topicNum === tIndex) {
            if (_nav === 'next') {
              if (pageNum === topic.pages.length - 1) {
                firstlastPage = true;
              }
            } else {
              if (pageNum === 0) {
                firstlastPage = true;
              }
            }
          }
        }
      });
      // check not forceHome false and NOT very first or last page in course...
      if (state.courseContent.global._forceHome === false) {
        if (pageNum === 0 && topicNum === 0) {
          // do nothing - leave as disabled
        } else if (topicNum === state.topics.length - 1 && pageNum === state.topics[topicNum].pages.length - 1) {
          // do nothing - leave as disabled
        } else {
          firstlastPage = false;
        }
        
      }
      return firstlastPage;
    },

    //------- TITLES - COLOURING ------//
    changeColour: state => (_str: string, _number: number, _colour: string) => {
      var res = _str.split("|");
        var newStr = '<div>';
        res.forEach((part: any, index: number) => {
            if(res.length > 1) {
              if (index === _number) {
                  newStr += '<span class="' + _colour + '">' + res[index] + "</span>";
              } else {
                  newStr += res[index];
              }
            } else {
              newStr += res[index];
            }
        });
        newStr += '</div>';
        return newStr;
    },
    
    //------- REMOVE CHARACTERS FROM STRINGS (ACCESSIBILITY) ------// 
    removeCharStr: state => (_str: string) => {
      _str = _str.replace( /(<([^>]+)>)/ig, ' ');
      let res =_str.split("|");
        var newStr = '';
        res.forEach((part: any, index: number) => {
          newStr += res[index];
        });
        return newStr;
    },


    //------- ACCESSIBILITY FOCUS ------//
    setAccessibilityFocus: state => (_elem: any) => {
      setTimeout(() => {
        const acc = (_elem as HTMLElement);
        if(acc) {
          acc.focus();
          //console.log(acc);
        }
      }, 100);
    },


     //------- DEVICES ------//
     setDevice: (state, getters) => (_device: string) => {
      Vue.set(state, 'device', _device);
      getters.write;
    },

    setOrientation: (state, getters) => (_orient: string) => {
      //console.log(_orient, state.device);
      Vue.set(state, 'orientation', _orient);
      //getters.write;
    },


    //------ SCORM -------//
    initSCORM: (state, getters) => {
      state.lms.scorm = pipwerks.SCORM;
      state.lms.scorm.version = '1.2';
      state.lms.scorm.init();
      if (state.lms.scorm.isAvailable()) {
        state.lms.startTime = new Date().getTime();
        getters.getSCORMSuspendData;
        //getters.getSCORMBookmark;
      }
    },
    saveSCORM: (state, getters) => {
      if (state.lms.scorm.isAvailable()) {
        state.lms.endTime = new Date().getTime();
        const duration = state.lms.endTime - state.lms.startTime;
        state.lms.scorm.set("cmi.core.session_time", getters.convertMillisecondsToHHMMSS(duration));
        if (state.lms.scorm.get("cmi.core.lesson_status") !== "completed") {
          state.lms.scorm.set("cmi.core.lesson_status", "incomplete");
        }
        state.lms.scorm.save();
        state.lms.scorm.quit();
      }
    },
    convertMillisecondsToHHMMSS: (state, getters) => (milliseconds: number) => {
      var seconds = Math.floor(milliseconds / 1000) % 60,
      minutes = Math.floor(milliseconds / 1000 / 60) % 60,
      hours = Math.floor(milliseconds / 1000 / 60 / 60);

      return((hours < 10) ? "0" + hours : hours) + ":" +
      ((minutes < 10) ? "0" + minutes : minutes) + ":" +
      ((seconds < 10) ? "0" + seconds : seconds);
    },
    setSCORMBookmark: (state, getters) => (_bookmark: string) => {
      if (_bookmark !== '' && _bookmark !== 'undefined' && _bookmark !== undefined) {
        if (state.courseContent.config.lms === true && state.lms.scorm.isAvailable()) {
          state.lms.scorm.set('cmi.core.lesson_location', _bookmark);
          // also save progress
          let suspenddata = JSON.stringify(state.topics);
          suspenddata += '*' + state.language;
          if (state.courseContent.global._assessment === true) {
            suspenddata += '*' + state.assessAttempts + '*' + state.assessPassed;
          }
          state.lms.scorm.set("cmi.suspend_data", suspenddata);
        }
        Vue.set(state, 'bookmark', _bookmark);
      }
    },
    getSCORMBookmark: (state, getters) => {
      let bookmark = state.bookmark;
      //console.log('getSCORMBookmark >> ' + bookmark);
      if (state.lms.scorm.isAvailable()) {
        bookmark = state.lms.scorm.get('cmi.core.lesson_location');
        //console.log('getSCORMBookmark >> SCORM available: ' + bookmark);
        state.bookmark = bookmark;
        if (bookmark !== null && bookmark !== 'null') {
          state.tempbookmark = bookmark;
        }
      }
    },
    getSCORMSuspendData: (state, getters) => {
      let suspenddata;
      //console.log('getSCORMSuspendData >> ');
      if (state.lms.scorm.isAvailable()) {
        suspenddata = state.lms.scorm.get('cmi.suspend_data');
       // console.log('getSCORMSuspendData >> ' + suspenddata);
        if (suspenddata !== 'null' && suspenddata !== '') {
          let suspendArray: any = suspenddata.split('*');
          if (state.courseContent.global._assessment === true) {
            state.assessPassed = suspendArray[3] === "true" ? true : false;
            state.assessAttempts = Number(suspendArray[2]);
            state.language = suspendArray[1];
            //console.log('getSCORMSuspendData >> ' + suspendArray[0], JSON.parse(suspendArray[0]));
            state.topics = JSON.parse(suspendArray[0]);
          } else {
            state.language = suspendArray[1];
            state.topics = JSON.parse(suspendArray[0]);
          }
          getters.write;
        }
      }
    },
    setSCORMComplete: state =>  {
      if (state.lms.scorm.isAvailable()) {
        if (state.lms.scorm.get('cmi.core.lesson_status') !== 'completed') {
          //state.lms.scorm.set('cmi.core.lesson_status', 'completed');
          //state.lms.scorm.save();
        }
      }
    },
    setSCORMScore: state => (_score: number, _passScore: number) => {
      state.lms.scorm.set("cmi.core.score.raw", _score);
      state.lms.scorm.set("cmi.core.score.min", 0);
      state.lms.scorm.set("cmi.core.score.max", 100);

      if(_score >= _passScore) {
        state.lms.scorm.set('cmi.core.lesson_status', 'passed');
      } else {
        state.lms.scorm.set('cmi.core.lesson_status', 'failed');
      }

      // const range = 100 - 0;
      // const scaledScore = ((_score - 0) / range).toFixed(7);
      // state.lms.scorm.set("cmi.core.score.scaled", scaledScore);

      state.lms.scorm.save();
    },

    //------- ANIMATYE MENU ICON ------//

    animateMenuIcon: (state, getters) => {
      state.animMenuIcon = true;
      getters.write;

      setTimeout(() => {
        state.animMenuIcon = false;
        getters.write;
      }, 1000);
    },


    //------- SAVING ------//
    write: (state, getters) => {
      if (state.courseContent.config.lms === false) {
        window.localStorage.setItem(state.courseContent.config.courseid, JSON.stringify(state));
      }
      return true;
    },
    clear: (state, getters) => {
      if (state.courseContent.config.lms === false) {
        window.localStorage.removeItem(state.courseContent.config.courseid);
        getters.setPages;
      }
      return true;
    },
    revive: (state, getters) => {
      const suspendString = window.localStorage.getItem(state.courseContent.config.courseid);
      if (suspendString !== null) {
        const suspendObject = JSON.parse(suspendString);
        state.bookmark = suspendObject.bookmark;
        state.language = suspendObject.language;
        state.direction = suspendObject.direction;
        state.topics = suspendObject.topics;
        state.route = suspendObject.route; 
        state.assessAttempts = suspendObject.assessAttempts;
        state.assessPassed = suspendObject.assessPassed;
        state.subtitles = false;
        getters.write;
      } else {
        // set-up the data stored for course progress
        getters.setPages;
      }
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
