import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Route, useHistory } from 'react-router-dom';
import { AppTopbar } from './AppTopbar';
import { AppFooter } from './AppFooter';
import { AppMenu } from './AppMenu';
import { AppProfile } from './AppProfile';
import { AppConfig } from './AppConfig';
import { ServicePaths } from './components/api/ServicePaths';
import { Dashboard } from './components/Dashboard';
import PrimeReact from 'primereact/api';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import './layout/flags/flags.css';
import './layout/layout.scss';
import './App.scss';
import { Sidebar } from 'primereact/sidebar';
import config from 'react-global-configuration';
import axios from 'axios';
import { ServiceLoggingConfig } from './components/api/ServiceLoggingConfig';

config.set({ "axios": {"baseURL": 'http://localhost:8000'  }},  { freeze: false});


axios.interceptors.request.use(function (config_axios) {
    // Do something before request is sent
    console.log(config.get("axios"))
    config_axios.baseURL = config.get("axios").baseURL;
    return config_axios;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

const App = () => {

    const [layoutMode, setLayoutMode] = useState('static');
    const [layoutColorMode, setLayoutColorMode] = useState('dark')
    const [inputStyle, setInputStyle] = useState('outlined');
    const [ripple, setRipple] = useState(false);
    const [sidebarActive, setSidebarActive] = useState(true);
    const history = useHistory();

    let menuClick = false;

    useEffect(() => {
        if (sidebarActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [sidebarActive]);

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    }

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value)
    }

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode)
    }

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode)
    }

    const onWrapperClick = (event) => {
        if (!menuClick && layoutMode === "overlay") {
            setSidebarActive(false);
        }
        menuClick = false;
    }

    const onToggleMenu = (event) => {
        menuClick = true;

        setSidebarActive((prevState) => !prevState);

        event.preventDefault();
    }

    // const onSidebarClick = () => {
    //     menuClick = true;
    // }

    const onMenuItemClick = (event) => {
        if (!event.item.items && layoutMode === "overlay") {
            setSidebarActive(false);
        }
    }

    const menu = [
        { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
        {
            label: 'Configuration', icon: 'pi pi-fw pi-sitemap',
            items: [
                { label: 'ML model Paths', icon: 'pi pi-fw pi-id-card', to: '/servicepaths' },
                { label: 'Logging config', icon: 'pi pi-fw pi-id-card', to: '/logging_config' },
            ]
        },
        { label: 'Documentation', icon: 'pi pi-fw pi-question', command: () => { window.location = "#/documentation" } },
        { label: 'View Source', icon: 'pi pi-fw pi-search', command: () => { window.location = "https://github.com/primefaces/sigma-react" } }
    ];

    const addClass = (element, className) => {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    const removeClass = (element, className) => {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    const logo = layoutColorMode === 'dark' ? 'assets/layout/images/logo-white.svg' : 'assets/layout/images/logo.svg';

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-active': sidebarActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false
    });

    const sidebarClassName = classNames('layout-sidebar', {
        'layout-sidebar-dark': layoutColorMode === 'dark',
        'layout-sidebar-light': layoutColorMode === 'light'
    });

    return (
        <div className={wrapperClass} onClick={onWrapperClick}>
            
            <Sidebar visible={sidebarActive} onHide={() => setSidebarActive(false)}
            className={sidebarClassName}
            >
                <div className="layout-logo" style={{cursor: 'pointer'}} onClick={() => history.push('/')}>
                        <img alt="Logo" src={logo} />
                </div>
                <AppProfile />
                <AppMenu model={menu} onMenuItemClick={onMenuItemClick} />
            </Sidebar>
            <AppTopbar onToggleMenu={onToggleMenu} />
            <AppConfig
                rippleEffect={ripple}
                onRippleEffect={onRipple}
                inputStyle={inputStyle} 
                onInputStyleChange={onInputStyleChange}
                layoutMode={layoutMode} 
                onLayoutModeChange={onLayoutModeChange} 
                layoutColorMode={layoutColorMode} 
                onColorModeChange={onColorModeChange} 
            />

            <div className="layout-main">
                <Route path="/" exact component={Dashboard} />
                <Route path="/servicepaths" component={ServicePaths} />
                <Route path="/logging_config" component={ServiceLoggingConfig} />
            </div>
            <AppFooter />
        </div>
    );

}

export default App;
