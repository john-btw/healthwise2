import { Component, Mixins, Watch, Prop, Vue } from "vue-property-decorator";

@Component
export default class BaseComponent extends Vue {
  @Prop({ required: true })
  protected element!: any;

  public isVisible: boolean = false;
  public isActive: boolean = false;


  public getScreenAriaContent() {
    if(this.isVisible) {
      let compName = this.element._component;
      compName = compName.replace("-","");
      compName = compName.replace("-","");
      let str = this.$store.state.courseContent.global._accessibility._components[compName] + " " + this.$store.state.courseContent.global._accessibility.status + " " + (this.$store.getters.getContentStatus(this.element._id, 'complete') ? this.$store.state.courseContent.global._accessibility.complete : this.$store.state.courseContent.global._accessibility.incomplete) + "";
      //this.element.content.title + ". " + 
      return str;
    }
  }

  public unlockNext() {
    
    if(this.$store.state.device === 'phone') {
      if(this.element._component === 'text-image' || this.element._component === 'text-overlay') {
        this.$store.getters.setContentStatus(this.element._id, 'complete', true);  
      }
      const element = (this.$refs[this.$store.getters.getNextPageID] as Element);
      this.$store.getters.setContentCompleteUnlockNext(this.element._id, element);
      
      //add instructional text
      const bodyElement = (this.$refs.bodyContent as Element);
      if(bodyElement) {
        //console.log('bodyElement');
        const _el = bodyElement as HTMLElement;
        let str = _el!.innerHTML;
        if(str) {
          const addIns = str.search(this.$store.state.courseContent.global.continueMobileIns);
          if(addIns === -1) {
            if(this.element._component === 'carousel') {
              const removeIns = str.search(this.element.content.ins);
              if(removeIns !== -1) {
                _el!.innerHTML = "";
              }
            }
            if (!this.$store.getters.checkIfLastScreenInPage(this.element._id)) {
              _el!.innerHTML += this.$store.state.courseContent.global.continueMobileIns;
            } else {
              const addInsL = str.search(this.$store.state.courseContent.global.continueMobileLastIns);
              if(addInsL === -1) {
                _el!.innerHTML += this.$store.state.courseContent.global.continueMobileLastIns;
              }
            }
          }
        }
      }

    }

    // Vue.nextTick(() => {
        //console.log(this.$store.state.bookmark, this.element._id);
        
        if (this.$store.state.bookmark === this.element._id) {

        const element = (this.$refs[this.$store.getters.getNextPageID] as Element);
        
        this.$store.getters.setContentCompleteUnlockNext(this.element._id, element);
        // if(this.$store.state.device === 'phone') {
          // this.$store.getters.setContentStatus(this.element._id, 'complete', true);  
        // }

        //add instructional text
        const bodyElement = (this.$refs.bodyContent as Element);
        if(bodyElement) {
          const _el = bodyElement as HTMLElement;
          let str = _el!.innerHTML;
          //console.log(_el, str);
          if(str) {
            if(this.$store.state.device !== 'phone') {
              const addIns = str.search(this.$store.state.courseContent.global.continueLabel);
              if(addIns === -1) {
                if(this.element._component === 'carousel') {
                  const removeIns = str.search(this.element.content.ins);
                  if(removeIns !== -1) {
                    _el!.innerHTML = "";
                  }
                }
                _el!.innerHTML += this.$store.state.courseContent.global.continueIns; 
                //if not text-image, remove the faded-out class!
                if(this.element._component !== 'text-image') {
                  const childrens = _el.children;
                  if(childrens.length > 0) {
                    [].forEach.call(childrens, function(_els, index) {
                      const _el2 = _els as HTMLElement;
                      if(index === childrens.length-1) {
                        //_el2.classList.remove('faded-out');
                        _el2.classList.add('fade-in');
                      }  
                    })        
                  }
                }
                this.addToMenuLinks(_el);
              }

            } else {
              const addIns = str.search(this.$store.state.courseContent.global.continueMobileIns);
              if(addIns === -1) {
                if(!this.$store.getters.checkIfLastScreenInPage(this.element._id)) {
                   _el!.innerHTML += this.$store.state.courseContent.global.continueMobileIns;
                } else {
                  const addInsL = str.search(this.$store.state.courseContent.global.continueMobileLastIns);
                  if(addInsL === -1) {
                    _el!.innerHTML += this.$store.state.courseContent.global.continueMobileLastIns;
                  }
                }
              }
            }
          } else {
            if(this.element._component === 'click-reveal-images') {
              this.addToMenuLinks(_el);
            }
          }
        }
      }

   // });
  }

  public addToMenuLinks(_el: Element) {
    Vue.nextTick(() => {
      const linksEl = _el.querySelectorAll("[id='toMenu']");
      linksEl.forEach((link: any, index: number) => {
       // console.log(link, index);
        let elem = (link as Element);
        elem!.removeEventListener("click", this.removeEL);
        //console.log('ADD >> ' + link, '- elem: ' + elem + ' -', this.element._id, this.element._component);
        elem!.addEventListener("click", ()=> { 
         // console.log('CLICK >> ' + link, '- elem: ' + elem + ' -', this.element._id, this.element._component);
          if(this.$route.name !== '/menu') {
            this.$router.replace({path: '/menu'}); 
          }
        });
      });
    });
  }

  public removeMenuLinks() {
    const bodyElement = (this.$refs.bodyContent as Element);
    if(bodyElement) {
      const _el = bodyElement as HTMLElement;
      Vue.nextTick(() => {
        const linksEl = _el.querySelectorAll("[id='toMenu']");
        linksEl.forEach((link: any, index: number) => {
          let elem = (link as Element);
          elem!.removeEventListener("click", this.removeEL);
        });
      });
    }
  }

  public removeEL() {

  }

  public getTopicTitle() {
    let title = '';
    if(this.$store.state.courseContent.topics[this.$store.state.topic]) {
      title = this.$store.state.courseContent.topics[this.$store.state.topic].title;
    }
    //if a <br> in title, remove it
    var res = title.split("<br/>");
    //title = title.replace("<br/>", " - "); 
    if(res.length > 1) {
      title = res[1];
    }
    //carry on with colours
    if(this.element._component === 'text-image'){ // || this.element._component === 'media'
      title = this.$store.getters.changeColour(title, 0, 'btw-main');
    } else if (this.element._component === 'click-reveal-hotspots' || this.element._component === 'steps' || this.element._component === 'carousel') { //
      title = this.$store.getters.changeColour(title, 1, 'btw-white');
    } else {
      title = this.$store.getters.changeColour(title, 0, 'btw-main');
    }
    return title;
  }
  
  public visibilityChanged (isVisible: boolean, entry: any) {
    this.isVisible = isVisible;
    this.isActive = this.isVisible;
    
    // once in view - set as completed (if text only)
    if (this.isVisible && this.element._component === 'plain-text') {
      if (this.$store.getters.getContentStatus(this.element._id, 'locked') === false && !this.element.content.button) {
        this.$store.getters.setContentStatus(this.element._id, 'complete', true);
      }
    }
    if(this.isVisible && (this.element._component === 'text-image' || this.element._component === 'text-overlay' || (this.element._component === 'steps' && this.$store.state.device === 'phone'))) {
      const element = (this.$refs[this.$store.getters.getNextPageID] as Element);
      this.$store.getters.setContentCompleteUnlockNext(this.element._id, element);
      //add instructional text
      const bodyElement = (this.$refs.bodyContent as Element);
      if(bodyElement) {
        const _el = bodyElement as HTMLElement;
        let str = _el!.innerHTML;
        if(str) {
          if(this.$store.state.device !== 'phone') {
            const addIns = str.search(this.$store.state.courseContent.global.continueLabel);
            if(addIns === -1) {
              _el!.innerHTML += this.$store.state.courseContent.global.continueIns;
              this.addToMenuLinks(_el);    
            }
            
          } else {
            const addIns = str.search(this.$store.state.courseContent.global.continueMobileIns);
            if(addIns === -1) {
              if (!this.$store.getters.checkIfLastScreenInPage(this.element._id)) {
                _el!.innerHTML += this.$store.state.courseContent.global.continueMobileIns;
              } else {
                const addInsL = str.search(this.$store.state.courseContent.global.continueMobileLastIns);
                if(addInsL === -1) {
                  _el!.innerHTML += this.$store.state.courseContent.global.continueMobileLastIns;
                }
              }
            }
          }
        }
      }
    }
    if(this.isVisible && (this.element._component !== 'text-image' && this.element._component !== 'text-overlay' && this.element._component !== 'steps')) {
      const bodyElement = (this.$refs.bodyContent as Element);
      if(bodyElement) {
        const _el = bodyElement as HTMLElement;
        let str = _el!.innerHTML;
        if(str) {
          let newStr = str.replace(this.$store.state.courseContent.global.continueIns, "");
          newStr = newStr.replace(this.$store.state.courseContent.global.continueMobileIns, "");
          _el!.innerHTML = newStr;
          this.addToMenuLinks(_el);  
        }
      }
    }
    if (this.isVisible){
      this.$store.getters.setSCORMBookmark(this.element._id);
      this.$store.getters.write;
    }
    if (!this.isVisible){
        this.removeMenuLinks();
    }
  }

  public focusStart() {
    Vue.nextTick(() => {
      const acc = (this.$refs.accessibility as HTMLElement);
     // console.log(this.$refs.accessibility);
      if(acc) acc.focus();
    });
  }
  
}