/*
<INICIO>::=				/	class id { <INSTRUCCIONES_CLASE> }
<INSTRUCCIONES_CLASE>::=/	<DECLARACION_METODO><INSTRUCCIONES_CLASE>
						|	<DECLA><INSTRUCCIONES_CLASE>
						|	<ASIGNACION><INSTRUCCIONES_CLASE>
						|	epsilon
<LLAVES>::= 			/	{ <INSTRUCCIONES> }
<INSTRUCCIONES>::=		/	<DECLARACION><INSTRUCCIONES>
						|	<ID><INSTRUCCIONES>
						|	<IF><INSTRUCCIONES>
						|	<SWITCH><INSTRUCCIONES>
						|	<FOR><INSTRUCCIONES>
						|	<WHILE><INSTRUCCIONES>
						|	<DO><INSTRUCCIONES>
						|	<IMPRIMIR><INSTRUCCIONES>
						|	return <LISTA_EXPRESIONES> ; <INSTRUCCIONES>
						|	break ; <INSTRUCCIONES>
						|	continue ; <INSTRUCCIONES>
						|	epsilon


<DECLARACION_METODO>::=	/	void id ( <LISTA_PARAMETROS> ) <LLAVES>
<DECLA>::=				/	<TIPO_DATO> id <DECLA'>
<DECLA'>::=				/	<LISTA_ID'> <DECLA''> ;
						|	( <LISTA_PARAMETROS> ) <LLAVES>
<DECLA''>::= 			/	= <EXPRESION>
						|	epsilon

<LISTA_ID'>::=			/	, id <LISTA_ID'>
						|	epsilon

<LISTA_PARAMETROS>::=	/	<PARAMETRO>	<LISTA_PARAMETROS'>
						|	epsilon
<PARAMETRO>::=			/	<TIPO_DATO> id
<LISTA_PARAMETROS'>::=	/	, <PARAMETRO> <LISTA_PARAMETROS'>
						|	epsilon

<DECLARACION>::=		/	<TIPO_DATO> id <LISTA_ID'> <DECLARACION'> ;
<DECLARACION'>::=		/	= <EXPRESION>
						|	epsilon
<ASIGNACION>::=			/	id = <EXPRESION> ;
<ID>::=					/	id <ID'> ;
<ID'>::=				/	( <LISTA_EXPRESIONES> )
						|	=	<EXPRESION>

<IF>::=					/	if ( <EXPRESION> ) <LLAVES> <ELSE>
<ELSE>::= 				/	else <ELSE'>
						|	epsilon
<ELSE'>::=				/	<IF>
						|	<LLAVES>
<SWITCH>::=				/	switch ( <EXPRESION> ) { <LIST_CASE><DEFAULT><LIST_CASE> }
<LIST_CASE>::=			/	<CASE><LIST_CASE>
						|	epsilon
<CASE>::=				/	case <EXPRESION> : <INSTRUCCIONES> break ;
<DEFAULT>::=			/	default : <INSTRUCCIONES> break ;
						|	epsilon
<FOR>::= 				/	for ( <DECLARACION> ; <EXPRESION> ; id <INCREMENTO> ) <LLAVES>
<WHILE>::=				/	while ( <EXPRESION> ) <LLAVES>
<DO>::=					/	do <LLAVES> while ( <EXPRESION> ) ;
<INCREMENTO>::=			/	++
						|	--

<IMPRIMIR>:= 			/	Console . Write ( <EXPRESION> ) ;

<TIPO_DATO>::= 			/	int
						|	double
						|	char
						|	bool
						|	string

<EXPRESION>::= 			/	<E><LOGICO_RELACIONAL>
<LOGICO_RELACIONAL>::= 	/	&& <EXPRESION>
						|	|| <EXPRESION>
						|	== <EXPRESION>
						|	!= <EXPRESION>
            			|	> <EXPRESION>
            			|	< <EXPRESION>
            			|	<= <EXPRESION>
            			|	>= <EXPRESION>
            			|	epsilon
<E>::= 					/	<T><EP>
<EP>::= 				/	+ <T><EP>
    					|	- <T><EP>
    					|	epsilon
<T>::= 					/	<F><TP>
<TP>::= 				/	* <F><TP>
    					|	/ <F><TP>
    					|	epsilon
<F>::= 					/	<NAME>
						|	numero
						|	cadena
						|	cadena_html
						|	true
						|	false
						|	- <EXPRESION>
						|	! <EXPRESION>
						|	( <EXPRESION> )

<NAME>::=				/	id <NAME'>
<NAME'>::=				/	( <LISTA_EXPRESIONES> )
						|	epsilon
<LISTA_EXPRESIONES>::=	/	<EXPRESION> <LISTA_EXPRESIONES>
						|	epsilon
<LISTA_EXPRESIONES'>::=	/	, <EXPRESION> <LISTA_EXPRESIONES'>
						|	epsilon
*/