![1-Sign-up](https://github.com/UzairTajdar/Kenigram/assets/126019289/7e004486-cf7b-406e-bb43-5b974599fc22)
![Uploading 2-Sign-in.png…]()
![3-Home](https://github.com/UzairTajdar/Kenigram/assets/126019289/612b786f-fbce-4ed9-83f7-01938920d566)
![4-Explore](https://github.com/UzairTajdar/Kenigram/assets/126019289/a2614624-8ece-40f2-92fc-af35a1bd0461)
![5-People](https://github.com/UzairTajdar/Kenigram/assets/126019289/f7315321-0e9a-4dea-8941-6dbc076bc14f)
![6-Saved](https://github.com/UzairTajdar/Kenigram/assets/126019289/29d3b789-e576-4da3-9c3d-8be49d742df8)
![7-PostDetail](https://github.com/UzairTajdar/Kenigram/assets/126019289/f5daa65f-98c5-4885-8902-02af628f62be)
![8-Profle](https://github.com/UzairTajdar/Kenigram/assets/126019289/fb78ec34-6a18-420a-84b8-47e9c0b35ad0)
![9-EditProfile](https://github.com/UzairTajdar/Kenigram/assets/126019289/be0a3f5b-eaaf-47db-b399-045b724f014e)
![Create-1](https://github.com/UzairTajdar/Kenigram/assets/126019289/4246c488-445e-4aa7-97b0-1fcca0d36a8d)
![Create-2](https://github.com/UzairTajdar/Kenigram/assets/126019289/d1ed9ea5-f147-492f-8e36-c520e253d5c2)

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
