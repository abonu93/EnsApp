import { mount } from "svelte";
import "$lib/styles/global.css";
import App from "./App.svelte";

const target = document.getElementById("app");
if (!target) throw new Error("Mount target #app not found");

mount(App, { target });
