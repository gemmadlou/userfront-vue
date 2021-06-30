import Vue from "vue";
import AnyMod from "@anymod/core";
import Core from "@userfront/core";

const {
  Singleton,
  alias,
  render,
  processPage,
  addScript1ToDocument,
  createOrReturnPage,
  checkPageAndUpdate,
  executeCallbacks,
  logErrorsAndTips,
} = AnyMod;

const { registerUrlChangedEventListener, addInitCallback } = Core;
alias.setAlias("Userfront");

Singleton.Opts.api = true;

/**
 * The order of operations is:
 *  1. Userfront.init() is called
 *  2. Callback is fired that adds Script1 to document and sets Singleton.isScript1Loading = true
 *  3. Userfront.build() is called
 *  4. componentDidMount() is called
 *  5. mountTools() is called
 *  6a. If Script1 hasn't loaded yet, wait for it to load
 *  6b. If Script1 has loaded, continue
 *  7. runAnyModSetup() is called
 */

// Callback to fire whenever Userfront.init is called
addInitCallback(({ tenantId }) => {
  Singleton.External.project = tenantId;
  addScript1ToDocument(
    "https://mod.userfront.com/v3/page/",
    tenantId,
    runAnyModSetup
  );
});

registerUrlChangedEventListener();

window.addEventListener("urlchanged", render);

async function runAnyModSetup() {
  if (Singleton.isScript1Loading) return;
  try {
    const page = await createOrReturnPage();
    const updatedPage = await checkPageAndUpdate(page);
    await processPage(updatedPage);
    executeCallbacks();
    logErrorsAndTips();
  } catch (error) {
    console.log(error);
  }
}

async function mountTools() {
  try {
    runAnyModSetup();
  } catch (err) {
    let message = err && err.message ? err.message : "Problem loading page";
    console.warn(message, err);
  }
}

export function build(name) {
  return Vue.component(name, {
    props: {
      toolId: {
        type: String,
        // required: true,
      },
    },
    template: '<div><div :id="`userfront-${toolId}`"></div></div>',
    async mounted() {
      await mountTools();
    },
  });
}

export const SignupForm = build("signup-form");
export const LoginForm = build("login-form");
export const PasswordResetForm = build("password-reset-form");
export const LogoutButton = build("logout-button");

export const Userfront = {
  build,
  SignupForm,
  LoginForm,
  PasswordResetForm,
  LogoutButton,
};

for (const attr in Core) {
  if (!Userfront[attr]) Userfront[attr] = Core[attr];
}

// export default Userfront;
