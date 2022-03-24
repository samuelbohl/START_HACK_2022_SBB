import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>

    <svg style={{height: 0}}>
    <symbol id="SBB_product_ic-1" viewBox="0 0 59 20"><path d="M42.4 4.218v11.564h-2.31v-7.57h-2.721V6.535c.564-.015 1.024-.073 1.38-.174.356-.1.682-.263.977-.49.427-.327.714-.878.862-1.653H42.4zM9.249 4.2h4.07L8.284 15.8H4.197zM16 4.2h14.443l-1.496 3.445H18.632l-2.048 4.71h10.32L25.409 15.8H10.965l5.034-11.6z"></path></symbol>
    <symbol id="SBB_product_ic-11" viewBox="0 0 59 20"><path d="M42.403 4.235V15.8h-2.31V8.23h-2.721V6.553c.564-.016 1.024-.074 1.38-.174.356-.1.682-.264.977-.49.427-.328.714-.879.862-1.654h1.812zm7.713 0V15.8h-2.31V8.23h-2.721V6.553c.565-.016 1.025-.074 1.38-.174.357-.1.682-.264.978-.49.427-.328.714-.879.862-1.654h1.811zM9.252 4.2h4.07L8.287 15.8H4.2zm6.75 0h14.444L28.95 7.645H18.635l-2.048 4.71h10.32L25.412 15.8H10.968l5.034-11.6z"></path></symbol>
    <symbol id="SBB_product_ic-2" viewBox="0 0 59 20"><path d="M44.78 13.864v2.057h-8.329c0-.628.101-1.226.305-1.796s.489-1.06.858-1.471a7.955 7.955 0 0 1 1-.926c.383-.3 1.144-.851 2.283-1.653.553-.385.941-.743 1.162-1.076.222-.332.333-.717.333-1.154 0-.507-.15-.917-.447-1.23-.298-.314-.69-.471-1.175-.471-1.192 0-1.806.857-1.843 2.57h-2.223v-.253c0-1.402.393-2.489 1.179-3.259.764-.748 1.753-1.123 2.966-1.123 1.076 0 1.975.306 2.698.918.785.664 1.178 1.558 1.178 2.681 0 .981-.314 1.825-.941 2.532a4.418 4.418 0 0 1-.578.557c-.179.14-.651.476-1.416 1.009-.727.506-1.248.894-1.562 1.163a6.226 6.226 0 0 0-.874.925h5.427zM9.249 4.2h4.07L8.284 15.8H4.197zM16 4.2h14.443l-1.496 3.445H18.632l-2.048 4.71h10.32L25.409 15.8H10.965l5.034-11.6z"></path></symbol>
    <symbol id="SBB_product_ic-21" viewBox="0 0 59 20"><path d="M44.783 13.743V15.8h-8.329c0-.628.102-1.226.305-1.796.203-.57.489-1.06.858-1.471a7.95 7.95 0 0 1 1-.925c.383-.301 1.144-.852 2.283-1.654.553-.385.94-.743 1.162-1.076.222-.332.333-.717.333-1.154 0-.507-.15-.917-.447-1.23-.298-.314-.69-.471-1.175-.471-1.192 0-1.806.857-1.843 2.57h-2.223v-.252c0-1.403.393-2.49 1.179-3.26.764-.748 1.753-1.123 2.966-1.123 1.076 0 1.975.306 2.697.918.786.664 1.18 1.558 1.18 2.682 0 .98-.315 1.824-.942 2.53a4.44 4.44 0 0 1-.578.558c-.179.14-.651.476-1.416 1.009-.727.506-1.248.894-1.562 1.163a6.224 6.224 0 0 0-.874.925h5.426zm6.629-9.508V15.8h-2.31V8.23h-2.721V6.553c.565-.016 1.025-.074 1.38-.174.357-.1.682-.264.978-.49.427-.328.714-.879.862-1.654h1.811zM9.252 4.2h4.07L8.287 15.8H4.2zm6.75 0h14.444L28.95 7.645H18.635l-2.048 4.71h10.32L25.412 15.8H10.968l5.034-11.6z"></path></symbol>
    <symbol id="SBB_product_ic-3" viewBox="0 0 59 20"><path d="M36.696 7.88c.027-.95.261-1.745.704-2.389.717-1.033 1.796-1.55 3.236-1.55 1.107 0 2 .282 2.681.846.733.612 1.1 1.403 1.1 2.373 0 .58-.144 1.08-.431 1.5a2.124 2.124 0 0 1-1.167.85c.622.142 1.114.458 1.475.949.361.49.542 1.083.542 1.78 0 1.144-.422 2.08-1.266 2.808-.78.675-1.766 1.012-2.958 1.012-1.292 0-2.317-.372-3.073-1.115-.757-.744-1.135-1.748-1.135-3.014v-.15h2.222c0 .712.169 1.261.507 1.649.337.388.814.581 1.431.581.617 0 1.092-.182 1.424-.545a1.78 1.78 0 0 0 .459-1.227c0-.57-.195-1.02-.585-1.352-.322-.274-.818-.412-1.487-.412-.19 0-.378.011-.562.032v-1.7c.137.01.269.015.395.015 1.33 0 1.994-.493 1.994-1.479 0-.432-.145-.782-.435-1.048-.29-.266-.673-.4-1.147-.4-.543 0-.963.17-1.258.507-.295.337-.454.83-.475 1.479h-2.19zM9.249 4.2h4.07L8.284 15.8H4.197zM16 4.2h14.443l-1.496 3.445H18.632l-2.048 4.71h10.32L25.409 15.8H10.965l5.034-11.6z"></path></symbol>
    <symbol id="SBB_product_ic-4" viewBox="0 0 59 20"><path d="M44.886 11.204v1.954h-1.455V15.8h-2.254v-2.642H36.35v-2.167l4.944-6.756h2.136v6.97h1.455zm-3.662.024V6.925l-2.974 4.303h2.974zM9.252 4.2h4.07L8.287 15.8H4.2zm6.75 0h14.444L28.95 7.645H18.635l-2.048 4.71h10.32L25.412 15.8H10.968l5.034-11.6z"></path></symbol>
    <symbol id="SBB_product_ic-5" viewBox="0 0 59 20"><path d="M44.206 4.235v2.057h-4.66l-.497 2.603c.558-.591 1.273-.886 2.143-.886.854 0 1.598.229 2.231.688.939.69 1.408 1.74 1.408 3.148 0 1.382-.501 2.476-1.503 3.283-.78.633-1.714.949-2.8.949-1.224 0-2.207-.328-2.95-.985-.744-.656-1.137-1.544-1.18-2.662h2.27c.038.406.17.752.396 1.036.354.449.844.673 1.472.673.606 0 1.086-.219 1.44-.657.342-.427.513-.946.513-1.558 0-.664-.179-1.196-.537-1.594-.359-.398-.836-.597-1.432-.597-.728 0-1.295.327-1.7.98l-2.065-.031 1.1-6.447h6.351zM9.252 4.2h4.07L8.287 15.8H4.2zm6.75 0h14.444L28.95 7.645H18.635l-2.048 4.71h10.32L25.412 15.8H10.968l5.034-11.6z"></path></symbol>
    <symbol id="SBB_product_ic-51" viewBox="0 0 59 20"><path d="M44.206 4.235v2.057h-4.66l-.498 2.602c.56-.59 1.274-.886 2.144-.886.854 0 1.598.23 2.23.689.94.69 1.409 1.74 1.409 3.148 0 1.382-.501 2.476-1.503 3.283-.78.632-1.714.949-2.8.949-1.224 0-2.207-.328-2.95-.985-.744-.656-1.137-1.544-1.18-2.662h2.27c.038.406.17.752.396 1.036.354.449.844.673 1.472.673.606 0 1.086-.219 1.44-.657.342-.427.513-.946.513-1.558 0-.664-.179-1.196-.537-1.594-.36-.398-.836-.597-1.432-.597-.728 0-1.295.327-1.7.98l-2.066-.03 1.1-6.448h6.352zm7.206 0V15.8h-2.31V8.23h-2.721V6.553c.565-.016 1.024-.074 1.38-.174.356-.1.682-.264.977-.49.428-.327.715-.878.863-1.654h1.811zM9.252 4.2h4.07L8.287 15.8H4.2zm6.75 0h14.444L28.95 7.645H18.635l-2.048 4.71h10.32L25.412 15.8H10.968l5.034-11.6z"></path></symbol>
    <symbol id="SBB_product_ic-6" viewBox="0 0 59 20"><path d="M44.586 7.122h-2.2c-.205-.89-.711-1.336-1.518-1.336-.854 0-1.46.524-1.82 1.574-.147.427-.266 1.073-.355 1.938.348-.47.718-.807 1.111-1.013.393-.205.866-.308 1.42-.308 1.086 0 1.959.385 2.618 1.155.628.727.942 1.64.942 2.736 0 1.303-.422 2.35-1.266 3.14-.76.713-1.672 1.069-2.737 1.069-1.366 0-2.428-.516-3.188-1.547-.759-1.03-1.139-2.469-1.139-4.315 0-1.972.406-3.517 1.218-4.635.786-1.081 1.86-1.622 3.22-1.622 1.281 0 2.262.43 2.942 1.29.39.495.641 1.12.752 1.874zm-3.916 2.65c-.553 0-.994.232-1.32.696-.296.412-.444.902-.444 1.472 0 .564.15 1.057.451 1.479.327.47.775.704 1.345.704.554 0 1-.224 1.337-.672.316-.422.474-.92.474-1.495 0-.565-.142-1.047-.427-1.448-.348-.49-.82-.736-1.416-.736zM9.252 4.2h4.07L8.287 15.8H4.2zm6.75 0h14.444L28.95 7.645H18.635l-2.048 4.71h10.32L25.412 15.8H10.968l5.034-11.6z"></path></symbol>
    <symbol id="SBB_product_ic-61" viewBox="0 0 59 20"><path d="M44.586 7.122h-2.2c-.205-.89-.711-1.336-1.518-1.336-.854 0-1.46.525-1.82 1.574-.147.427-.266 1.073-.355 1.938.348-.47.718-.807 1.111-1.013.393-.205.866-.308 1.42-.308 1.086 0 1.959.385 2.618 1.155.628.727.942 1.64.942 2.737 0 1.302-.422 2.349-1.266 3.14-.76.712-1.672 1.068-2.737 1.068-1.366 0-2.428-.516-3.188-1.547-.759-1.03-1.139-2.469-1.139-4.315 0-1.972.406-3.517 1.218-4.635.786-1.081 1.86-1.622 3.22-1.622 1.281 0 2.262.43 2.942 1.29.39.496.641 1.12.752 1.874zm-3.916 2.65c-.553 0-.994.232-1.32.697-.296.41-.444.901-.444 1.47 0 .565.15 1.058.451 1.48.327.47.775.704 1.345.704.554 0 1-.224 1.337-.672.316-.422.474-.92.474-1.495 0-.565-.142-1.047-.427-1.448-.348-.49-.82-.736-1.416-.736zm10.742-5.537V15.8h-2.31V8.23h-2.721V6.553c.565-.016 1.025-.074 1.38-.174.357-.1.682-.264.978-.49.427-.328.714-.878.862-1.654h1.811zM9.252 4.2h4.07L8.287 15.8H4.2zm6.75 0h14.444L28.95 7.645H18.635l-2.048 4.71h10.32L25.412 15.8H10.968l5.034-11.6z"></path></symbol>
    <symbol id="SBB_product_ic-7" viewBox="0 0 59 20"><path d="M44.499 4.235v1.962c-.064.069-.25.282-.562.64-.432.496-.862 1.12-1.29 1.872a12.9 12.9 0 0 0-.996 2.163c-.501 1.44-.804 3.082-.91 4.928h-2.389c.016-.87.168-1.835.455-2.895.288-1.06.684-2.12 1.19-3.18.723-1.498 1.456-2.613 2.2-3.346h-5.458V4.235h7.76zM9.252 4.2h4.07L8.287 15.8H4.2zm6.75 0h14.444L28.95 7.645H18.635l-2.048 4.71h10.32L25.412 15.8H10.968l5.034-11.6z"></path></symbol>
    <symbol id="SBB_product_ic-8" viewBox="0 0 59 20"><path d="M38.463 9.59c-.538-.184-.95-.487-1.238-.91-.287-.421-.43-.933-.43-1.534 0-1.002.41-1.8 1.233-2.397.728-.527 1.593-.79 2.595-.79 1.139 0 2.07.313 2.792.94.685.591 1.028 1.322 1.028 2.192 0 .606-.145 1.126-.435 1.558-.29.433-.701.747-1.234.941.417.122.757.277 1.02.467.734.533 1.1 1.31 1.1 2.334 0 1.176-.45 2.112-1.352 2.808-.76.585-1.736.878-2.927.878-1.292 0-2.32-.322-3.085-.965-.797-.67-1.195-1.548-1.195-2.634 0-1.018.353-1.807 1.06-2.365a2.924 2.924 0 0 1 1.068-.523zm2.112.87c-.57 0-1.035.176-1.396.527-.361.35-.542.8-.542 1.348 0 .565.183 1.023.55 1.377.366.353.842.53 1.428.53.664 0 1.163-.195 1.495-.586.321-.374.482-.807.482-1.297 0-.559-.184-1.018-.554-1.376-.353-.348-.84-.522-1.463-.522zm.016-4.706c-.506 0-.915.141-1.226.423-.311.282-.467.653-.467 1.112 0 .48.157.863.47 1.15.315.288.735.432 1.263.432.527 0 .943-.143 1.25-.427s.458-.673.458-1.163c0-.48-.154-.855-.463-1.124-.308-.269-.737-.403-1.285-.403zM9.252 4.2h4.07L8.287 15.8H4.2zm6.75 0h14.444L28.95 7.645H18.635l-2.048 4.71h10.32L25.412 15.8H10.968l5.034-11.6z"></path></symbol>
    <symbol id="SBB_product_ic-9" viewBox="0 0 59 20"><path d="M36.652 12.897h2.183c.18.897.699 1.345 1.558 1.345.485 0 .88-.165 1.183-.495.303-.33.536-.842.7-1.538.105-.443.182-.947.23-1.511-.354.496-.716.848-1.088 1.056-.372.208-.824.312-1.357.312-.85 0-1.587-.247-2.215-.743a3.501 3.501 0 0 1-1.024-1.353 4.4 4.4 0 0 1-.368-1.803c0-1.303.446-2.357 1.337-3.164.764-.697 1.682-1.045 2.752-1.045.66 0 1.269.148 1.828.443a3.965 3.965 0 0 1 1.408 1.258c.67.965 1.004 2.32 1.004 4.066 0 1.614-.295 2.99-.886 4.13-.77 1.481-1.935 2.222-3.496 2.222-1.039 0-1.897-.288-2.575-.862-.677-.575-1.069-1.348-1.174-2.318zm3.844-6.985c-.496 0-.915.203-1.258.61-.343.41-.514.933-.514 1.566 0 .511.124.965.372 1.36.337.543.812.815 1.424.815a1.58 1.58 0 0 0 1.329-.665c.31-.416.466-.912.466-1.487 0-.606-.16-1.12-.482-1.542a1.606 1.606 0 0 0-1.337-.657zM9.252 4.2h4.07L8.287 15.8H4.2zm6.75 0h14.444L28.95 7.645H18.635l-2.048 4.71h10.32L25.412 15.8H10.968l5.034-11.6z"></path></symbol>
    <symbol id="SBB_product_ic" viewBox="0 0 59 20"><path d="M9.249 4.2h4.07L8.284 15.8H4.197zM16 4.2h14.443l-1.496 3.445H18.632l-2.048 4.71h10.32L25.409 15.8H10.965l5.034-11.6z"></path></symbol>
    <symbol id="SBB_oev_b_t02" viewBox="0 0 20 20"><path d="M17.3 15.7c.2 0 .3-.1.3-.3l-.3-1.9h-3.2v2.2h3.2zm-6.7-9.5L12.3 5 10 3.7 7.7 5l1.8 1.2h1.1zm3.3 3.3c0 .2.1.3.3.3h1.6c.2 0 .3-.1.3-.3l-.3-2.4c0-.2-.2-.3-.3-.3h-1.3c-.2 0-.3.1-.3.3v2.4zM9.7 6.8H2.5v-.6h5.9L6.5 5 10 3l3.5 2-1.9 1.2h3.8c.5 0 .9.3.9.8l.8 5.9H2.5V9.8h7.2c.2 0 .3-.1.3-.3 0-.2-.1-.3-.3-.3H2.5v-.6h7.2c.2 0 .3-.1.3-.3S9.9 8 9.7 8H2.5v-.6h7.2c.2 0 .3-.1.3-.3 0-.1-.1-.3-.3-.3zM6.5 15c0-.9.7-1.6 1.6-1.6s1.6.7 1.6 1.6-.7 1.6-1.6 1.6c-.9 0-1.6-.7-1.6-1.6m3.7 0c0-.9.7-1.6 1.6-1.6s1.6.7 1.6 1.6-.7 1.6-1.6 1.6-1.6-.7-1.6-1.6M2.5 2.8h15v-.3h-15v.3zm0 14.7h15v-.6h-15v.6zm0-3.9l3.4-.1v2.2H2.5v-2.1z"></path></symbol>
    <symbol id="SBB_08_arrow_down" viewBox="0 0 24 24"><path d="M13.6 7.5l-.8.8 3.7 3.7h-12v1h12l-3.7 3.7.8.7 5-5"></path></symbol>
    </svg>
    <link rel="icon" type="image/png" href="https://cdn.app.sbb.ch/favicons/sbb/v2/favicon-16x16.png" sizes="16x16"></link>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
