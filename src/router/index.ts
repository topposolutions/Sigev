import { createRouter, createWebHistory } from "vue-router";
// @ts-ignore
import redirectIfAuthenticated from "../common/middleware/redirectIfAuthenticated";
// @ts-ignore
import checkAuth from "../common/middleware/checkAuth";

const routes = [
  {
    path: "/login",
    name: "login",
    // @ts-ignore
    component: () => import("../views/Login.vue"),
    meta: {
      requiresAuth: false,
     // middleware: [redirectIfAuthenticated],
    },
  },

  {
    path: "/login-no-image",
    name: "login-no-image",
    // @ts-ignore
    component: () => import("../views/LoginClean.vue"),
    meta: {
      requiresAuth: false,
     // middleware: [redirectIfAuthenticated],
    },
  },

  {
    path: "/",
    name: "home",  //redirect
    // @ts-ignore
    component: () => import("../layout/index.vue"),
    //meta: { requiresAuth: true, middleware: checkAuth },
    children: [
      {
        path: "/upload",
        name: "Upload",
        // @ts-ignore
        component: () => import("../views/upload/Upload.vue"),
        //meta: { requiresAuth: true, middleware: checkAuth },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Creates a `nextMiddleware()` function which not only
// runs the default `next()` callback but also triggers
// the subsequent Middleware function.
// @ts-ignore
function nextFactory(context, middleware, index) {
  const subsequentMiddleware = middleware[index];
  // If no subsequent Middleware exists,
  // the default `next()` callback is returned.
  if (!subsequentMiddleware) return context.next;
  // @ts-ignore
  return (...parameters) => {
    // Run the default Vue Router `next()` callback first.
    context.next(...parameters);
    // Then run the subsequent Middleware with a new
    // `nextMiddleware()` callback.
    const nextMiddleware = nextFactory(context, middleware, index + 1);
    subsequentMiddleware({ ...context, next: nextMiddleware });
  };
}

router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware];

    const context = {
      from,
      next,
      router,
      to,
    };
    const nextMiddleware = nextFactory(context, middleware, 1);

    return middleware[0]({ ...context, next: nextMiddleware });
  }

  return next();
});

export default router;
