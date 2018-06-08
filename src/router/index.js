import Vue from "vue";
import Router from "vue-router";

import {
  firebaseAuth
} from "@/config/firebaseConfig";

Vue.use(Router);

const router = new Router({
  routes: [{
      path: '*',
      redirect: '/login'
    },
    {
      path: '/alternativeLogin',
      component: () =>
        import ('@/components/AlternativeLogin')
    },
    {
      path: '/login',
      component: () =>
        import ('@/components/Login')
    },
    {
      path: '/register',
      component: () =>
        import ('@/components/Register')
    },
    {
      path: "/",
      component: () =>
        import ('@/components/Dashboard'),
      meta: {
        authenticated: true
      },
      children: [{
          path: "",
          name: 'home',
          component: () =>
            import ('@/components/Home'),
          meta: 'DashBoard'
        },
        {
          path: "/claimants",
          name: "claimants",
          component: () =>
            import ("@/components/Claimant"),
          meta: {
            title: 'Solicitantes'
          },
          children: [{
              path: "list",
              name: "claimants-list",
              component: () =>
                import ("@/components/ClaimantList"),
              meta: {
                title: "List"
              }
            },
            {
              path: "form",
              name: "claimants-form",
              component: () =>
                import ("@/components/ClaimantForm"),
              meta: {
                title: "Nuevo"
              }
            }
          ]
        },
      ]
    },
    // {
    //   path: "/category",
    //   name: "category",
    //   component: () =>
    //     import ("@/components/Category"),
    //   children: [{
    //       path: "list",
    //       name: "category-list",
    //       component: () =>
    //         import ("@/components/CategoryList")
    //     },
    //     {
    //       path: "form",
    //       name: "category-form",
    //       component: () =>
    //         import ("@/components/CategoryForm")
    //     }
    //   ]
    // },
    // {
    //   path: "/note",
    //   name: "note",
    //   component: () =>
    //     import ("@/components/Note"),
    //   children: [{
    //       path: "list",
    //       name: "note-list",
    //       component: () =>
    //         import ("@/components/NoteList")
    //     },
    //     {
    //       path: "form",
    //       name: "note-form",
    //       component: () =>
    //         import ("@/components/NoteForm")
    //     }
    //   ]
    // },
    // {
    //   path: "/event",
    //   name: "event",
    //   component: () =>
    //     import ("@/components/Event"),
    //   children: [{
    //       path: "list",
    //       name: "event-list",
    //       component: () =>
    //         import ("@/components/EventList")
    //     },
    //     {
    //       path: "form",
    //       name: "event-form",
    //       component: () =>
    //         import ("@/components/EventForm")
    //     }
    //   ]
    // },
    // {
    //   path: "/place",
    //   name: "place",
    //   component: () =>
    //     import ("@/components/Place"),
    //   children: [{
    //       path: "list",
    //       name: "place-list",
    //       component: () =>
    //         import ("@/components/PlaceList")
    //     },
    //     {
    //       path: "form",
    //       name: "place-form",
    //       component: () =>
    //         import ("@/components/PlaceForm")
    //     }
    //   ]
    // },
    // {
    //   path: "/documents",
    //   name: "document",
    //   component: () =>
    //     import ("@/components/Document"),
    //   children: [{
    //       path: "list",
    //       name: "document-list",
    //       component: () =>
    //         import ("@/components/DocumentList")
    //     },
    //     {
    //       path: "form",
    //       name: "document-form",
    //       component: () =>
    //         import ("@/components/DocumentForm")
    //     }
    //   ]
    // }
  ]
});

import {
  store
} from '../store'

router.beforeEach((to, from, next) => {
  let currentUser = store.getters.currentUser
  let authenticated = to.matched.some(record => record.meta.authenticated)

  if (authenticated && !currentUser) next('/login')
  else if (!authenticated && currentUser) next('/')
  else next()
})

export default router