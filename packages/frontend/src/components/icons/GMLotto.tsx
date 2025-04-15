import React from 'react';

interface GMLottoProps {
  width?: number;
  height?: number;
  className?: string;
  fill?: string;
}

export default function GMLotto({ 
  width = 300, 
  height = 300, 
  className = '',
  fill = '#000000'
}: GMLottoProps) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            xmlnsXlink="http://www.w3.org/1999/xlink" 
            version="1.1" 
            width={width} 
            height={height} 
            viewBox="505,124.5,700,700"
            className={className}
            fill={fill}
        >
            <g 
                fill={"currentColor"} 
                fillRule="nonzero" 
                stroke="none" 
                strokeWidth="1" 
                strokeLinecap="butt" 
                strokeLinejoin="miter" 
                strokeMiterlimit="10" 
                strokeDasharray="" 
                strokeDashoffset="0" 
                fontFamily="none" 
                fontWeight="none" 
                fontSize="none" 
                textAnchor="none" 
                style={{ mixBlendMode: "normal" }}
            >
                <g id="stage">
                    <g id="layer1 1">
                        <path d="M779.67456,156.74419c-1.1379,0.24333 -3.82009,0.89222 -6.09589,1.54112c-2.19452,0.64889 -8.04658,2.35223 -13.00456,3.73112c-4.87671,1.37889 -9.26575,2.8389 -9.75342,3.24446c-0.40639,0.40556 -1.21918,0.73 -1.86941,0.73c-0.65023,0 -6.82739,2.19001 -13.73607,4.9478c-23.32693,9.16558 -48.11687,22.79229 -67.46117,36.98677c-4.38904,3.16334 -8.6968,6.48891 -9.59087,7.30002c-0.89406,0.81112 -2.68219,2.35223 -4.06393,3.32556c-12.67945,9.81447 -36.90044,34.22898 -48.44199,48.91013c-2.19452,2.8389 -5.03927,6.48891 -6.33972,8.03003c-4.14521,5.19113 -16.01187,23.03562 -21.9452,33.09343c-6.50228,10.95003 -16.33698,30.90342 -20.31963,41.36678c-4.79543,12.57225 -11.46027,33.58009 -13.41095,42.34012c-2.11324,9.73336 -3.08858,14.19449 -3.4137,16.62783c-0.40639,2.8389 -1.30046,7.62447 -1.70685,9.32781c-0.56895,2.35223 -2.68219,20.68339 -3.33242,27.98341c-0.7315,9.65225 -0.7315,49.55903 0,56.77794c0.32511,3.08223 0.81279,7.8678 1.05662,10.54447c0.24383,2.67667 1.05662,8.35447 1.70685,12.57225c0.65023,4.21779 1.38173,9.00336 1.62557,10.54447c0.24383,1.54112 0.65023,3.40668 0.89406,4.05557c0.24383,0.64889 0.56895,2.27111 0.81279,3.65001c0.16256,1.29778 1.38173,6.65113 2.68219,11.76115c15.44291,60.83351 50.71779,118.17923 98.75339,160.43823c12.51689,10.95003 33.56802,26.92897 35.68127,26.92897c0.16256,0 0.32511,-2.35223 0.40639,-5.27224c0.16256,-6.40779 0.65023,-9.81447 2.19452,-14.84338c0.56895,-2.1089 1.1379,-4.21779 1.1379,-4.70445c0,-0.48667 -4.14521,-4.05557 -9.1032,-8.03003c-37.71323,-29.68675 -67.54244,-68.05242 -88.75614,-113.96144c-8.61552,-18.73672 -19.99451,-57.34572 -22.02647,-74.62244c-0.24383,-2.43334 -0.89406,-7.05668 -1.30046,-10.13891c-1.62557,-11.76115 -1.95069,-17.60116 -1.95069,-37.31121c0.08127,-24.17118 0.24383,-30.74119 1.38173,-37.71677c0.81279,-5.59669 1.21918,-8.27336 1.86941,-13.22114c1.05662,-8.19224 6.58356,-31.39009 9.8347,-41.93457c9.50958,-30.25453 22.83926,-56.94016 42.58994,-85.57247c6.50228,-9.49002 20.64474,-25.87452 31.69862,-36.90566c23.57076,-23.44118 47.14154,-40.55567 75.67029,-54.83127c41.93971,-20.92673 83.06664,-30.74119 131.58991,-31.30898c10.15981,-0.16223 33.32419,1.21667 38.52602,2.27111c0.97534,0.16223 3.33242,0.48667 5.36438,0.73c2.03196,0.24333 5.85206,0.81112 8.53424,1.29778c2.68219,0.48667 5.44566,0.97333 6.09589,1.05445c0.65023,0.16223 2.11324,0.48667 3.25114,0.73c1.1379,0.32444 2.92602,0.73 4.06393,0.89222c4.71415,0.89222 23.73332,6.32669 31.45478,8.92225c36.65661,12.65337 69.08673,31.22787 97.53422,55.96683c9.50958,8.27336 24.87122,23.68451 31.94246,32.12009c2.43835,2.92 4.63287,5.43446 4.87671,5.67779c1.05662,0.97333 13.81735,18.65561 17.23105,23.92784c17.71872,27.25342 33.81186,64.24018 40.07031,92.46693c4.14521,18.65561 4.71415,21.73784 6.58356,36.09455c1.70685,13.70782 1.95069,17.19561 2.03196,36.90566c0,20.44005 -0.7315,30.33565 -3.82009,49.88348c-1.21918,7.70558 -5.44566,27.41563 -6.90867,32.03898c-4.79543,15.57338 -6.74612,21.4945 -7.64018,23.52228c-0.56895,1.29778 -2.03196,4.86668 -3.08858,7.78669c-1.1379,2.92 -3.00731,7.46224 -4.22648,10.13891c-1.21918,2.59556 -2.76347,6.24558 -3.49498,8.03003c-2.35708,5.92113 -14.06118,26.60452 -20.40091,36.09455c-3.4137,5.11001 -6.50228,9.89558 -6.98995,10.62559c-0.40639,0.73 -2.35708,3.32556 -4.22648,5.67779c-1.86941,2.43334 -4.95799,6.40779 -6.82739,8.84113c-5.36438,6.97558 -22.10776,24.65785 -30.31688,31.95787c-13.97991,12.49115 -30.642,25.87452 -36.25021,28.95675c-0.97534,0.56778 -0.89406,1.37889 0.56895,5.7589c2.27579,6.65113 2.76347,9.32781 2.76347,14.76226c0,2.51445 0.32511,4.70445 0.65023,4.86668c1.21918,0.81112 18.77534,-11.27448 32.75524,-22.38673c37.38811,-29.93009 69.89952,-70.56686 89.6502,-112.17698c5.85206,-12.24781 13.00456,-29.93009 16.66209,-40.96123c4.22648,-13.05893 9.26575,-33.09343 9.99726,-40.15011c0.32511,-2.27111 1.21918,-7.70558 3.00731,-17.8445c1.78813,-9.9767 2.60091,-28.06452 2.19452,-49.96458c-0.24383,-12.65337 -0.56895,-23.76563 -0.81279,-24.65785c-0.16256,-0.89222 -0.65023,-4.54224 -0.89406,-8.11113c-0.56895,-6.00224 -1.30046,-11.59892 -2.51963,-17.8445c-0.24383,-1.37889 -0.81279,-4.46112 -1.1379,-6.89446c-0.40639,-2.43334 -0.97534,-5.35334 -1.21918,-6.48891c-5.2831,-23.03562 -6.82739,-28.47008 -12.84201,-45.0168c-15.76803,-43.80012 -39.50135,-81.67912 -71.76892,-114.69144c-15.76803,-16.06004 -35.19359,-32.12009 -51.61185,-42.66457c-3.33242,-2.19001 -7.5589,-4.86668 -9.34703,-6.08335c-10.07854,-6.73224 -32.43013,-17.92561 -47.54793,-23.92784c-7.15251,-2.75779 -23.73332,-8.51669 -25.60273,-8.84113c-0.40639,-0.08111 -1.1379,-0.32444 -1.62557,-0.56778c-0.40639,-0.32444 -2.84475,-0.97333 -5.2831,-1.54112c-2.43835,-0.56778 -6.50228,-1.62222 -8.94064,-2.27111c-14.63013,-4.13668 -35.9251,-7.70558 -52.42464,-8.92225c-14.54885,-1.13556 -48.60455,-0.97333 -58.92692,0.24333c-12.51689,1.46001 -25.84659,3.56893 -35.76256,5.75893c-2.92602,0.64889 -6.17718,1.3789 -7.31507,1.62223z" id="Path 1" />
                        <path d="M817.63163,225.68884c-9.1032,2.19001 -17.47488,6.89446 -24.05844,13.38337c-3.33242,3.40668 -9.8347,12.32892 -9.8347,13.6267c0,0.32444 2.84475,0.97333 6.33972,1.46001c3.49498,0.56778 8.45297,1.86557 10.89132,2.92l4.5516,2.02778l1.95069,-2.67667c4.30776,-6.08335 13.97991,-10.95003 21.70136,-10.95003c4.30776,0 11.78539,2.1089 15.36164,4.38001c3.90137,2.43334 11.13516,10.30114 13.24839,14.35671c0.89406,1.78445 1.86941,3.16334 2.19452,3.16334c0.32511,0 1.21918,-1.05445 2.03196,-2.35223c0.7315,-1.29778 3.73881,-4.78557 6.66483,-7.78669c5.12054,-5.35334 5.20183,-5.51557 4.06393,-7.62447c-2.19452,-4.2989 -8.53424,-11.27448 -13.57351,-15.08671c-8.94064,-6.73224 -16.33698,-9.24669 -28.28492,-9.73336c-5.52694,-0.16223 -10.15981,0.16223 -13.24839,0.89222M895.98411,252.45558c-5.85206,1.54112 -12.67945,5.27224 -17.71872,9.73336c-4.14521,3.5689 -10.81004,12.57225 -10.81004,14.51893c0,0.48667 2.11324,1.37889 4.71415,1.94667c2.51963,0.56778 6.25845,1.78445 8.20913,2.59556c1.95069,0.81112 3.82009,1.54112 4.22648,1.54112c0.32511,0 1.95069,-1.37889 3.57625,-3.08223c4.38904,-4.78557 11.05387,-7.78669 17.88128,-8.11113c3.16986,-0.16223 7.23379,0.08111 9.02191,0.56778c7.80274,2.1089 17.14976,10.95003 20.31963,19.22339c1.21918,3.08223 1.70685,3.65001 3.08858,3.16334c0.97534,-0.24333 4.63287,-1.21667 8.20913,-2.1089c3.57625,-0.89222 6.90867,-1.78445 7.47762,-1.94667c1.21918,-0.40556 -0.81279,-6.57002 -4.63287,-14.19449c-3.90137,-7.62447 -13.24839,-16.70893 -21.13241,-20.44005c-3.33242,-1.62222 -8.04658,-3.32556 -10.40364,-3.81223c-5.85206,-1.21667 -16.74337,-1.05445 -22.02647,0.40556M771.79055,269.0023c-9.59087,2.8389 -18.20639,8.92225 -24.05844,16.87116c-3.00731,4.05557 -7.39635,14.43782 -6.58356,15.65449c0.24383,0.40556 1.62557,0.73 3.00731,0.73c1.46302,0 5.20183,0.97333 8.29041,2.02778c3.16986,1.13556 5.77077,2.02778 5.77077,2.02778c0.08127,0 1.30046,-2.35223 2.68219,-5.27224c2.03196,-4.05557 3.65754,-6.08335 7.07123,-8.51669c13.00456,-9.65225 29.58538,-6.16446 39.3388,8.19224c1.78813,2.59556 3.25114,5.11001 3.25114,5.51557c0,1.62222 1.46302,0.89222 2.84475,-1.37889c0.7315,-1.21667 3.57625,-4.2989 6.33972,-6.81335l5.03927,-4.62335l-1.46302,-2.75779c-4.79543,-8.92225 -14.3863,-17.19561 -23.97716,-20.92673c-6.50228,-2.51445 -20.40091,-2.92 -27.55342,-0.73M856.64531,293.49792c-16.41826,2.19001 -29.26026,12.8967 -33.81186,28.06452c-1.78813,5.7589 -1.62557,6.32669 2.35708,11.51781c1.21918,1.54112 3.16986,4.78557 4.38904,7.1378c1.21918,2.35223 2.43835,4.21779 2.76347,4.05557c0.32511,-0.16223 1.95069,-0.81112 3.65754,-1.46001l3.00731,-1.13556v-5.51557c0,-3.5689 0.56895,-7.05668 1.70685,-9.9767c4.14521,-11.11226 19.6694,-16.79005 31.12967,-11.35559c5.03927,2.35223 11.13516,8.19224 13.08584,12.65337c0.97534,2.02778 1.78813,2.92 2.35708,2.43334c2.03196,-1.54112 8.45297,-4.78557 11.46027,-5.67779c1.78813,-0.56778 3.73881,-1.13556 4.30776,-1.37889c0.81279,-0.24333 0.40639,-1.62222 -1.54429,-5.19113c-8.61552,-16.22227 -27.71597,-26.52341 -44.86574,-24.17118M946.05168,304.77239c-2.76347,0.64889 -6.66483,2.1089 -8.6968,3.08223c-4.14521,2.19001 -11.94794,9.32781 -14.06118,12.8967l-1.38173,2.43334l3.00731,0.97333c1.70685,0.56778 5.60822,2.27111 8.6968,3.89335c3.73881,1.94667 5.85206,2.67667 6.58356,2.1089c0.48767,-0.40556 2.51963,-1.86557 4.38904,-3.32556c4.14521,-3.16334 10.72876,-4.62335 16.58082,-3.89335c4.95799,0.73 7.64018,1.94667 13.32968,6.16446c4.95799,3.73112 9.59087,12.00448 10.40364,18.81783c0.7315,5.84002 -0.7315,13.14004 -3.65754,17.8445l-2.43835,3.89335l3.73881,1.54112c2.03196,0.89222 3.98265,1.62222 4.30776,1.62222c0.32511,0 2.27579,1.05445 4.38904,2.43334c2.11324,1.29778 4.06393,2.43334 4.22648,2.43334c0.16256,0 1.62557,-2.27111 3.16986,-5.11001c4.22648,-7.54335 5.6895,-13.46449 5.6895,-22.87339c0,-13.38337 -3.90137,-22.87339 -13.32968,-32.44453c-5.2831,-5.43446 -10.15981,-8.5978 -17.47488,-11.4367c-4.79543,-1.86557 -6.98995,-2.27111 -14.06118,-2.27111c-5.03927,-0.08111 -10.32237,0.40556 -13.41095,1.21667M724.40517,304.44795c-21.5388,2.59556 -38.28218,16.87116 -43.484,36.98677c-1.62557,6.65113 -1.21918,17.52005 1.05662,23.6034c0.97534,2.67667 2.11324,5.19113 2.51963,5.59669c0.48767,0.48667 2.35708,-0.16223 4.87671,-1.78445c2.27579,-1.37889 4.30776,-2.51445 4.47031,-2.51445c0.24383,0 1.95069,-0.73 3.98265,-1.54112l3.57625,-1.54112l-1.21918,-4.78557c-0.97534,-3.89335 -0.97534,-5.59669 -0.24383,-9.9767c2.60091,-13.87004 13.16712,-23.76563 26.65936,-24.90118l4.95799,-0.48667l-1.54429,-3.5689c-0.81279,-2.02778 -1.78813,-6.16446 -2.03196,-9.24669c-0.32511,-3.08223 -0.81279,-5.7589 -1.05662,-5.84002c-0.24383,-0.16223 -1.38173,-0.16223 -2.51963,0M767.0764,322.86023c-11.21643,2.92 -18.69405,7.54335 -24.54611,15.24894c-3.33242,4.2989 -8.37168,14.11337 -8.37168,16.30337c0,0.73 1.78813,1.54112 4.71415,2.19001c2.51963,0.56778 6.50228,1.86557 8.6968,2.92l4.06393,1.86557l2.68219,-5.27224c3.00731,-6.00224 6.17717,-9.24669 11.86666,-12.16671c10.89132,-5.7589 25.19634,-1.70334 32.99907,9.24669c1.78813,2.51445 3.65754,5.92113 4.22648,7.62447c1.05662,3.65001 1.62557,3.81223 3.57625,0.81112c0.7315,-1.21667 3.65754,-4.46112 6.33972,-7.30002l4.87671,-5.11001l-2.35708,-4.62335c-4.63287,-8.76002 -15.76803,-17.68227 -26.17168,-20.84561c-5.60822,-1.78445 -17.63743,-2.19001 -22.59543,-0.89222M905.65625,338.02805c-2.03196,0.40556 -5.2831,1.29778 -7.31506,2.02778c-4.22648,1.54112 -12.19178,6.65113 -12.19178,7.70558c0,0.40556 1.78813,2.43334 3.90137,4.54224c2.11324,2.19001 5.03927,5.35334 6.421,7.1378c2.27579,2.92 2.60091,3.08223 3.82009,1.78445c1.86941,-1.78445 8.85935,-3.81223 13.49224,-3.81223c11.29772,0 22.18903,9.9767 23.97716,21.98117c0.32511,1.94667 0.65023,3.73112 0.81279,3.97445c0.7315,1.21667 -2.43835,11.27448 -4.79543,14.92449c-4.06393,6.40779 -9.18447,10.13891 -17.14976,12.65337c-1.78813,0.56778 -3.57625,1.29778 -3.90137,1.62222c-0.40639,0.32444 2.51963,2.67667 6.33972,5.27224c3.90137,2.51445 7.23379,5.19113 7.47762,5.7589c0.56895,1.62222 2.19452,1.37889 6.74612,-0.89222c8.29041,-4.21779 12.27306,-7.62447 16.90593,-14.60004c5.12054,-7.70558 6.50228,-12.16671 7.15251,-22.38673c0.56895,-9.24669 -0.56895,-14.84338 -5.03927,-23.6034c-8.53424,-16.87116 -29.01643,-27.49675 -46.65387,-24.09007" id="CompoundPath 1" />
                        <path d="M1017.8206,354.8992c0,1.37889 -0.7315,5.11001 -1.54429,8.19224l-1.62557,5.59669l4.38904,2.51445c9.91598,5.67779 17.3936,18.49338 16.41826,28.06452c-1.30046,12.65337 -11.29772,23.11674 -30.80455,32.28231c-12.84201,6.08335 -37.71323,13.87004 -49.57989,15.57338c-1.46302,0.24333 -7.39635,1.29778 -13.24839,2.35223c-11.21643,2.02778 -21.62009,3.40668 -30.88584,4.13668c-3.08858,0.24333 -6.50228,0.56778 -7.47762,0.73c-0.97534,0.16223 -12.59816,0.73 -25.84657,1.29778c-27.55342,1.13556 -59.90226,0.24333 -87.61823,-2.51445c-18.28766,-1.78445 -18.12511,-1.78445 -33.08036,-4.46112c-6.01461,-1.05445 -12.19178,-2.19001 -13.73607,-2.43334c-1.54429,-0.24333 -3.00731,-0.56778 -3.25114,-0.73c-0.24383,-0.16223 -1.86941,-0.56778 -3.49498,-0.81112c-4.71415,-0.73 -20.40091,-5.11001 -29.91049,-8.35447c-34.70592,-11.76115 -50.06756,-25.14452 -44.37806,-38.77122c1.54429,-3.5689 6.98995,-9.40892 10.64749,-11.4367c1.86941,-0.97333 2.76347,-1.94667 2.51963,-2.75779c-2.92602,-9.16558 -5.12054,-14.60004 -6.01461,-14.60004c-3.33242,0 -15.19908,8.35447 -20.40091,14.43782c-1.86941,2.1089 -4.71415,6.32669 -6.33972,9.49002c-2.60091,4.9478 -3.00731,6.57002 -3.33242,12.57225c-0.40639,8.43558 1.05662,14.11337 5.44566,20.84561c20.96986,32.12009 93.7954,53.77682 191.41089,56.94016c41.69587,1.37889 77.45842,-0.81112 112.24562,-6.81335c36.16894,-6.24558 66.56709,-17.52005 85.34243,-31.55231c16.66209,-12.57225 24.30228,-25.87452 24.30228,-42.66457c0.08127,-11.51781 -3.49498,-21.00784 -11.62283,-31.22787c-6.17717,-7.70558 -18.61278,-16.22227 -26.00913,-17.8445c-2.43835,-0.48667 -2.51963,-0.40556 -2.51963,1.94667" id="Path 1" />
                        <path d="M842.90924,354.49366c-9.99726,2.27111 -19.34428,8.76002 -25.19634,17.8445c-3.33242,5.11001 -3.82009,6.97558 -1.95069,6.97558c0.65023,0 4.06393,1.46001 7.47762,3.24446c7.07123,3.65001 8.12785,3.89335 8.77808,1.78445c1.46302,-4.54224 12.1105,-11.03114 18.69405,-11.4367c7.47762,-0.40556 17.3936,4.62335 21.9452,11.19336c6.50228,9.32781 6.01461,23.27895 -1.1379,33.17454l-2.35708,3.24446l7.72146,4.54224c4.14521,2.51445 7.80274,4.54224 7.96529,4.54224c0.24383,0 2.03196,-2.43334 3.98265,-5.51557c5.20183,-7.70558 7.31506,-14.35671 7.5589,-23.27895c0.24383,-9.81447 -0.65023,-14.11337 -4.63287,-22.22451c-9.18447,-18.65561 -29.01643,-28.38897 -48.84839,-24.09007M719.52847,369.33702c-3.73881,0.64889 -10.89132,3.5689 -14.71141,6.00224c-4.71415,3.00112 -11.13516,9.65225 -13.97991,14.60004c-3.98265,6.73224 -6.98995,23.03562 -4.38904,23.76563c0.48767,0.16223 4.30776,1.37889 8.45297,2.75779c4.14521,1.29778 7.64018,2.19001 7.88402,1.94667c0.32511,-0.24333 0.48767,-1.94667 0.48767,-3.73112c0.08127,-10.7067 6.25845,-20.60228 15.76803,-25.14452c3.4137,-1.70334 5.20183,-1.94667 10.2411,-1.78445c7.23379,0.24333 12.35433,2.51445 17.71872,7.8678l3.49498,3.40668l2.92602,-3.48779c1.62557,-1.86557 4.71415,-4.78557 6.90867,-6.48891l3.90137,-3.08223l-5.60822,-5.19113c-5.77077,-5.35334 -13.49224,-9.73336 -19.6694,-11.11226c-3.49498,-0.81112 -15.36164,-1.05445 -19.42557,-0.32444M971.49185,384.42373c-0.08127,0.08111 -0.16256,3.08223 -0.32511,6.65113c-0.16256,3.5689 -0.56895,7.46224 -0.89406,8.67892c-0.48767,1.86557 -0.32511,2.27111 0.81279,2.27111c2.27579,0 8.37168,4.05557 10.9726,7.30002c2.51963,3.16334 6.74612,11.68003 6.74612,13.5456c0,1.46001 0,1.46001 8.53424,-1.86557c8.37168,-3.32556 8.53424,-3.48779 6.09589,-10.54447c-3.08858,-9.24669 -11.94794,-19.22339 -20.23835,-22.71118c-2.76347,-1.21667 -11.62283,-3.65001 -11.7041,-3.32556M787.23346,388.56041c-12.92328,3.24446 -25.11506,13.6267 -29.91049,25.46896c-1.86941,4.62335 -4.14521,16.14116 -3.33242,16.95227c0.48767,0.48667 14.30502,3.48779 16.01187,3.48779c0.97534,0 1.54429,-0.97333 1.95069,-3.81223c1.46302,-9.89558 6.98995,-18.00672 14.63013,-21.4945c6.17717,-2.8389 14.79268,-2.59556 20.56347,0.56778c2.35708,1.29778 5.44566,3.5689 6.74612,5.0289c3.57625,4.13668 6.90867,11.4367 7.47762,16.38449c0.32511,2.43334 0.89406,4.78557 1.30046,5.19113c0.56895,0.56778 3.65754,0.56778 8.77808,0.08111l7.96529,-0.73l-0.24383,-6.00224c-0.7315,-17.60116 -12.35433,-33.82343 -28.44748,-39.82567c-5.85206,-2.19001 -17.47488,-2.8389 -23.48949,-1.29778M657.59424,465.85952c-10.15981,17.11449 -15.03653,27.33452 -20.23835,42.34012c-8.04658,23.68451 -10.89132,51.5057 -7.5589,75.51466c5.52694,39.98789 26.4968,78.11022 62.99084,114.61033c6.09589,6.08335 6.90867,12.8156 3.4137,27.98341c-2.43835,10.7067 -2.76347,18.81783 -0.81279,22.46785c1.62557,3.24446 6.09589,7.38113 8.94064,8.43558c1.30046,0.48667 4.30776,0.89222 6.82739,0.89222c7.31506,0 15.03653,-4.21779 23.73332,-12.8156c3.82009,-3.89335 8.20913,-8.5978 9.59087,-10.46337c2.51963,-3.16334 2.76347,-3.32556 5.6895,-2.67667c15.60547,3.48779 57.54518,4.62335 77.05202,2.1089c26.57807,-3.48779 46.24747,-8.84113 68.68034,-18.73672c6.421,-2.8389 16.41826,-7.94891 18.28766,-9.32781c0.48767,-0.40556 2.68219,-1.62222 4.87671,-2.8389c16.82465,-9.32781 38.9324,-28.79453 54.21276,-47.8557c20.0758,-25.06341 32.26757,-56.04794 34.46209,-87.60025l0.48767,-7.30002l-4.47031,-7.1378c-8.12785,-12.8156 -11.78539,-26.52341 -10.89132,-40.55567c0.48767,-7.21891 2.84475,-18.00672 4.71415,-21.17006c0.81279,-1.37889 0.65023,-1.46001 -1.05662,-0.97333c-0.97534,0.32444 -2.76347,0.73 -3.90137,0.97333c-2.35708,0.48667 -8.53424,1.86557 -10.9726,2.51445c-3.65754,0.89222 -24.87122,4.2989 -30.07305,4.78557c-7.31506,0.73 -20.48218,1.94667 -24.9525,2.35223c-3.00731,0.24333 -6.25845,0.64889 -7.31506,0.89222c-3.73881,0.81112 -70.54975,0.48667 -84.77348,-0.40556c-18.77534,-1.21667 -41.45204,-3.40668 -55.67578,-5.35334c-1.54429,-0.24333 -4.14521,-0.56778 -5.6895,-0.81112c-5.52694,-0.64889 -27.39086,-5.19113 -37.38811,-7.70558c-5.60822,-1.46001 -11.05387,-2.75779 -12.1105,-2.92c-1.05662,-0.24333 -2.76347,-0.81112 -3.65754,-1.29778c-0.97534,-0.48667 -1.78813,-0.81112 -1.95069,-0.73c-0.40639,0.40556 -18.45022,-5.84002 -27.39086,-9.40892c-4.87671,-1.94667 -13.49224,-5.92113 -19.01917,-8.84113c-5.52694,-2.8389 -10.07854,-5.19113 -10.15981,-5.19113c-0.08127,0 -1.78813,2.8389 -3.90137,6.24558M1026.19228,468.86064c-7.96529,7.62447 -7.96529,7.62447 -5.77077,8.43558c11.29772,4.38001 23.32693,12.24781 31.94246,20.84561c8.45297,8.43558 9.42831,9.57114 12.92328,16.70893c5.20183,10.46337 5.44566,20.35895 0.81279,26.4423c-3.08858,4.05557 -6.33972,5.43446 -13.00456,5.43446c-4.87671,0 -6.58356,-0.32444 -11.21643,-2.67667c-6.50228,-3.16334 -13.57351,-9.73336 -18.20639,-17.03338c-3.65754,-5.59669 -6.66483,-12.8156 -6.66483,-15.89783c0,-3.24446 -1.38173,-2.35223 -3.57625,2.19001c-3.4137,7.1378 -4.06393,11.92336 -2.60091,18.73672c1.78813,7.94891 5.20183,13.6267 12.67945,20.84561c10.5662,10.38225 20.72602,14.68115 33.97442,14.35671c7.07123,-0.16223 8.45297,-0.40556 13.32968,-2.8389c13.41095,-6.57002 20.96986,-21.57562 18.77534,-37.23011c-1.54429,-10.62559 -2.43835,-13.46449 -6.82739,-22.22451c-6.17717,-12.32892 -15.68676,-23.03562 -30.07305,-33.74232c-5.52694,-4.13668 -15.93059,-9.9767 -17.71872,-9.9767c-0.40639,0 -4.30776,3.40668 -8.77808,7.62447M1071.1393,593.20433c-0.24383,0.24333 -0.48767,1.05445 -0.48767,1.70334c0,4.38001 -17.14976,42.50234 -23.97716,53.37126c-8.37168,13.22114 -15.5242,23.27895 -21.05113,29.52453c-4.79543,5.51557 -15.93059,16.87116 -19.83195,20.27784l-3.49498,3.08223l1.38173,4.9478c0.81279,2.75779 1.78813,4.9478 2.19452,4.9478c1.1379,0 10.5662,-8.27336 17.96255,-15.81671c20.56347,-20.92673 36.49405,-49.88348 44.86574,-81.51689c3.57625,-13.46449 4.71415,-22.79229 2.43835,-20.52117M947.92108,732.87806c-3.33242,1.13556 -6.25845,2.19001 -6.421,2.27111c-0.16256,0.08111 1.38173,2.27111 3.49498,4.9478c9.75342,12.65337 20.48218,18.49338 36.73788,20.11561c3.49498,0.32444 6.01461,0.16223 6.25845,-0.24333c0.32511,-0.40556 -1.38173,-1.62222 -3.73881,-2.67667c-9.91598,-4.38001 -23.81461,-16.22227 -27.79725,-23.76563c-0.89406,-1.62222 -1.78813,-2.92 -2.03196,-2.92c-0.24383,0.08111 -3.16986,1.05445 -6.50228,2.27111M743.09923,757.77924c-4.14521,4.21779 -11.94794,10.05781 -16.41826,12.16671c-1.70685,0.81112 -3.08858,1.62222 -3.08858,1.86557c0,0.73 19.75068,9.00336 30.56072,12.73448c9.75342,3.40668 28.85388,8.76002 34.46209,9.57114c1.54429,0.24333 3.73881,0.64889 4.87671,0.89222c7.47762,1.46001 10.5662,2.02778 13.41095,2.35223c1.78813,0.24333 8.04658,1.05445 13.81735,1.78445c15.60547,1.94667 55.35066,2.02778 71.11869,0.08111c15.44291,-1.86557 33.40546,-5.51557 47.38537,-9.57114c10.72876,-3.08223 13.73607,-4.21779 28.20365,-10.46337c3.33242,-1.37889 6.74612,-2.75779 7.5589,-3.00112c2.60091,-0.81112 1.38173,-1.54112 -3.98265,-2.59556c-2.92602,-0.48667 -5.93333,-1.29778 -6.66483,-1.62222c-0.7315,-0.40556 -5.2831,-2.59556 -10.07854,-4.9478c-4.87671,-2.35223 -8.77808,-4.54224 -8.77808,-4.9478c0,-0.89222 -3.57625,-0.97333 -4.38904,-0.16223c-0.56895,0.64889 -2.92602,1.29778 -15.5242,4.78557c-11.86666,3.32556 -12.02922,3.32556 -21.5388,4.70445c-15.60547,2.35223 -21.05113,3.00112 -28.04109,3.5689c-17.3936,1.21667 -48.92966,0.08111 -62.58445,-2.27111c-2.68219,-0.48667 -8.85935,-1.54112 -13.81735,-2.35223c-4.87671,-0.81112 -9.67214,-1.70334 -10.5662,-1.94667c-20.8073,-5.51557 -35.84382,-10.46337 -39.74519,-13.22114c-0.89406,-0.56778 -1.86941,-1.13556 -2.11324,-1.13556c-0.24383,0 -2.11324,1.70334 -4.06393,3.73112" id="CompoundPath 1" />
                    </g>
                </g>
            </g>
        </svg>
    );
}