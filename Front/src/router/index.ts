import { createRouter, createWebHistory } from "vue-router";

import SignUpView from "@/views/SignUpView.vue";
import LoginView from "@/views/LoginView.vue";
import HomeView from "@/views/HomeView.vue";
import PostCreate from "@/views/PostCreateView.vue";
import PostDetail from "@/views/PostDetailView.vue";
import PostUpdate from "@/views/PostUpdateView.vue";
import NotFound from "@/views/NotFoundView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUpView,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/create",
    name: "Create",
    component: PostCreate,
  },
  {
    path: "/detail/:id",
    name: "Detail",
    component: PostDetail,
  },
  {
    path: "/update/:id",
    name: "Update",
    component: PostUpdate,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

export default router;
