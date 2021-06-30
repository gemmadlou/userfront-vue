import t from"vue";import o from"@anymod/core";import e from"@userfront/core";const{Singleton:r,alias:n,render:a,processPage:i,addScript1ToDocument:s,createOrReturnPage:c,checkPageAndUpdate:d,executeCallbacks:p,logErrorsAndTips:g}=o,{registerUrlChangedEventListener:m,addInitCallback:u}=e;async function l(){if(!r.isScript1Loading)try{const t=await c(),o=await d(t);await i(o),p(),g()}catch(t){console.log(t)}}function f(o){return t.component(o,{props:{id:{type:String,required:!0}},template:`<div><div id="userfront-${this.id}"></div></div>`,async mounted(){await async function(){try{l()}catch(t){console.warn(t&&t.message?t.message:"Problem loading page",t)}}()}})}n.setAlias("Userfront"),r.Opts.api=!0,u(({tenantId:t})=>{r.External.project=t,s("https://mod.userfront.com/v3/page/",t,l)}),m(),window.addEventListener("urlchanged",a);const w=f("signup-form"),v=f("login-form"),h=f("password-reset-form"),y=f("logout-button"),b={build:f,SignupForm:w,LoginForm:v,PasswordResetForm:h,LogoutButton:y};for(const t in e)b[t]||(b[t]=e[t]);export{v as LoginForm,y as LogoutButton,h as PasswordResetForm,w as SignupForm,b as Userfront,f as build};
//# sourceMappingURL=userfront-vue.modern.js.map
