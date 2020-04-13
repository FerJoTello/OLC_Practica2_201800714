/*
<INICIO>::=					class { <INSTRUCCIONES_CLASE> }
<INSTRUCCIONES_CLASE>::=	<DECLARACION_METODO><INSTRUCCIONES_CLASE>
						|	<DECLA><INSTRUCCIONES_CLASE>
						|	<ASIGNACION><INSTRUCCIONES_CLASE>
<LLAVES>::= 				{ <INSTRUCCIONES> }
<INSTRUCCIONES>::=			<DECLARACION><INSTRUCCIONES>
						|	<ASIGNACION><INSTRUCCIONES>
						|	<IF><INSTRUCCIONES>
						|	<SWITCH><INSTRUCCIONES>
						|	<FOR><INSTRUCCIONES>
						|	<WHILE><INSTRUCCIONES>
						|	<DO><INSTRUCCIONES>
						|	<IMPRIMIR><INSTRUCCIONES>
						|	epsilon

<TIPO_DATO>::= 				int
						|	double
						|	char
						|	bool
						|	string

<EXPRESION>::= 				<E><LOGICO_RELACIONAL>
<LOGICO_RELACIONAL>::= 		&& <E>
						|	|| <E>
						|	! <E>
						|	== <E>
						|	!= <E>
            			|	> <E>
            			|	< <E>
            			|	<= <E>
            			|	>= <E>
            			|	epsilon
<E>::= 						<T><EP>
<EP>::= 					+ <T><EP>
    					|	- <T><EP>
    					|	epsilon
<T>::= 						<F><TP>
<TP>::= 					* <F><TP>
    					|	/ <F><TP>
    					|	epsilon
<F>::= 						<VALOR>
    					|	( <E> )
<VALOR>::=					id
						|	numero
						|	cadena
						|	cadena_html	
						|	true
						|	false

<DECLARACION_METODO>::=		void id ( <LISTA_PARAMETROS> ) <LLAVES>

<DECLA>::=					<TIPO_DATO> id <DECLA'>
<DECLA'>::=					<LISTA_ID'> <DECLA''> ;
						|	( <PARAMETROS> ) <LLAVES>
<DECLA''>::= 				= <EXPRESION>
						|	epsilon

<DECLARACION>::=			<TIPO_DATO> id <LISTA_ID'> <DECLARACION'> ;
<DECLARACION'>::=			= <EXPRESION>
						|	epsilon
<ASIGNACION>::= 			id <LISTA_ID'> = <EXPRESION> ;

<LISTA_ID'>::=				, id <LISTA_ID'>
						|	epsilon

<LISTA_PARAMETROS>::=		<PARAMETRO>	<LISTA_PARAMETROS'>
						|	epsilon
<PARAMETRO>::=				<TIPO_DATO> id 
<LISTA_PARAMETROS'>::=		, <PARAMETRO> <LISTA_PARAMETROS'>
						|	epsilon	
<IF>::=						if ( <EXPRESION> ) <LLAVES> <ELSE>
<ELSE>::= 					else <ELSE'>
						|	epsilon
<ELSE'>::=					<IF>
						|	<LLAVES>
<SWITCH>::=					switch ( <EXPRESION> ) { <LIST_CASE><DEFAULT><LIST_CASE> }
<LIST_CASE>::=				<CASE><LIST_CASE>
						|	epsilon
<CASE>::=					case <EXPRESION> : <INSTRUCCIONES> break ;
<DEFAULT>::=				default : <INSTRUCCIONES> break ;
<FOR>::= 					for ( <DECLARACION> ; <EXPRESION> ; id <INCREMENTO> ) <LLAVES_REP>
<WHILE>::=					while ( <EXPRESION> ) <LLAVES_REP>
<DO>::=						do <LLAVES_REP> while ( <EXPRESION> ) ;
<INCREMENTO>::=				++
						|	--
<INSTRUCCIONES_REP>::=		break ;
						|	continue ;
						|	epsilon
<LLAVES_REP>::= 			{ <INSTRUCCIONES> <INSTRUCCIONES_REP> <INSTRUCCIONES>  }
<IMPRIMIR>:= 				Console . Write ( <EXPRESION> ) ;
*/