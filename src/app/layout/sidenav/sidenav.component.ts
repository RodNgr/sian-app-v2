import { Component, OnInit } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService } from '../../auth/services/auth.service';

import { MenuItem } from 'primeng/api';

import swal from 'sweetalert2';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  public items: MenuItem[] = [];

  constructor(private authService: AuthService,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.generarMenuMarketing();
    this.generarMenuRrhh();
    this.generarMenuInterfaz();
    this.generarMenuCuadratura();
    this.generarMenuCierreTiendas();
    this.generarMenuReporte();
    this.generarMenuCallCenter();
    this.generaMenuSeguridad();

    this.items.push({
      label: 'Usuario',
      icon: 'pi pi-fw pi-user',
      items: [
        { label: 'Cambiar Contraseña',  icon: 'pi pi-fw pi-key', command: () => {
          this.changePassword();
        } },
        { label: 'Cerrar Sesión', icon: 'pi pi-fw pi-sign-in', routerLink: '/auth/logout' },
      ]
    });
  }

  generarMenuMarketing(): void {
    if (this.authService.hasRole('ROL_SIAN_MARKETING')) {
      let menu: MenuItem = { label: 'Marketing', icon: 'pi pi-fw pi-chart-line', items: [] };

      let mantenimiento: MenuItem = { label: 'Mantenimiento', icon: 'pi pi-fw pi-folder', items: [] };
      if (this.authService.hasRole('ROL_SIAN_MKT_PREFIJO')) {
        mantenimiento.items?.push({ label: 'Prefijos', icon: 'pi pi-fw pi-table', routerLink: '/home/cupon/lista-prefijos', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_MKT_FORMATO_VALE')) {
        mantenimiento.items?.push({ label: 'Formatos Vale', icon: 'pi pi-fw pi-table', routerLink: '/home/cupon/lista-formato-vale', routerLinkActiveOptions: {exact: true} });
      }

      let control: MenuItem = { label: 'Control', icon: 'pi pi-fw pi-folder', items: [] };
      if (this.authService.hasRole('ROL_SIAN_MKT_CORPORATIVO')) {
        control.items?.push({ label: 'Vales Corporativos', icon: 'pi pi-fw pi-ticket', routerLink: '/home/cupon/lista-cupon-corporativo', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_MKT_ENTEL')) {
        control.items?.push({ label: 'Vales ENTEL', icon: 'pi pi-fw pi-ticket', routerLink: '/home/cupon/lista-cupon-entel', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_MKT_CORTESIA')) {
        control.items?.push({ label: 'Vales Cortesía', icon: 'pi pi-fw pi-ticket', routerLink: '/home/cupon/lista-vale-cortesia', routerLinkActiveOptions: 'active'} );
      }

     
      if (this.authService.hasRole('ROL_SIAN_MKT_OMNICANAL')) {
        control.items?.push({ label: 'Cupon Omnicanal', icon: 'pi pi-fw pi-ticket', routerLink: '/home/cupon/lista-cupon-omnicanal', routerLinkActiveOptions: 'active'} );
      }

      let proceso: MenuItem = { label: 'Proceso', icon: 'pi pi-fw pi-folder', items: [] };
      if (this.authService.hasRole('ROL_SIAN_MKT_SOLICITUD_DIEM')) {
        proceso.items?.push({ label: 'Solicitud Códigos DIEN', icon: 'pi pi-fw pi-cog', routerLink: '/home/cupon/lista-solicitud-diem', routerLinkActiveOptions: {exact: true} });
      }

      let reporte: MenuItem = { label: 'Reportes', icon: 'pi pi-fw pi-folder', items: [] }
      if (this.authService.hasRole('ROL_SIAN_MKT_REP_VALE')) {
        reporte.items?.push({ label: 'Consulta de Vales', icon: 'pi pi-fw pi-list', routerLink: '/home/cupon/consulta-vales', routerLinkActiveOptions: 'active'} );
        reporte.items?.push({ label: 'Vales', icon: 'pi pi-fw pi-list', routerLink: '/home/cupon/reporte-vales', routerLinkActiveOptions: 'active'} );
        reporte.items?.push({ label: 'Consulta de Cupones', icon: 'pi pi-fw pi-list', routerLink: '/home/cupon/reporte-cupon-omnicanal', routerLinkActiveOptions: 'active'});
      
      }

      if (this.authService.hasRole('ROL_SIAN_MKT_REP_DOCUMENTOS')) {
        reporte.items?.push({ label: 'Documentos Cobranza', icon: 'pi pi-fw pi-list', routerLink: '/home/cupon/reporte-documento-cobranza', routerLinkActiveOptions: 'active'}) ;
      }
      
      menu.items?.push(mantenimiento);
      menu.items?.push(control);
      menu.items?.push(proceso);
      menu.items?.push(reporte);

      this.items.push(menu)
    }
  }

  generarMenuRrhh(): void {
    if (this.authService.hasRole('ROL_SIAN_RRHH')) {
      let menu: MenuItem = { label: 'Recursos Humanos', icon: 'pi pi-fw pi-users', items: [] };
  
      let mantenimiento: MenuItem = { label: 'Configuración', icon: 'pi pi-fw pi-folder', items: [] };
      
      if (this.authService.hasRole('ROL_SIAN_RRHH_DESCUENTO_CARGO')) {
        mantenimiento.items?.push({ label: 'Descuento por Cargo de Empleado', icon: 'pi pi-fw pi-table', routerLink: '/home/rrhh/lista-descuento-cargo', routerLinkActiveOptions: {exact: true} });
      }
        
      menu.items?.push(mantenimiento);
      this.items.push(menu)
    }
  }

  generarMenuInterfaz(): void {
    if (this.authService.hasRole('ROL_SIAN_INTERFAZ')) {
      let menu: MenuItem = { label: 'Interfaz', icon: 'pi pi-fw pi-cog', items: [] };

      let mantenimiento: MenuItem = { label: 'Mantenimiento', icon: 'pi pi-fw pi-folder', items: [] };
      if (this.authService.hasRole('ROL_SIAN_ITZ_TIPO_CONSUMO')) {
        mantenimiento.items?.push({ label: 'Tipo de Consumo', icon: 'pi pi-fw pi-table', routerLink: '/home/interfaz/lista-tipo-consumo', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_ITZ_FAMILIA')) {
        mantenimiento.items?.push({ label: 'Familia', icon: 'pi pi-fw pi-table', routerLink: '/home/interfaz/lista-familia', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_ITZ_SUBFAMILIA1')) {
        mantenimiento.items?.push({ label: 'Sub Familia 1', icon: 'pi pi-fw pi-table', routerLink: '/home/interfaz/lista-subfamilia1', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_ITZ_SUBFAMILIA2')) {
        mantenimiento.items?.push({ label: 'Sub Familia 2', icon: 'pi pi-fw pi-table', routerLink: '/home/interfaz/lista-subfamilia2', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_ITZ_SUBFAMILIA3')) {
        mantenimiento.items?.push({ label: 'Sub Familia 3', icon: 'pi pi-fw pi-table', routerLink: '/home/interfaz/lista-subfamilia3', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_ITZ_SUBFAMILIA4')) {
        mantenimiento.items?.push({ label: 'Sub Familia 4', icon: 'pi pi-fw pi-table', routerLink: '/home/interfaz/lista-subfamilia4', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_ITZ_TIENDA')) {
        mantenimiento.items?.push({ label: 'Tiendas', icon: 'pi pi-fw pi-table', routerLink: '/home/interfaz/lista-tienda', routerLinkActiveOptions: {exact: true} });
      }

      let proceso: MenuItem = { label: 'Proceso', icon: 'pi pi-fw pi-folder', items: [] };
      if (this.authService.hasRole('ROL_SIAN_ITZ_ARTICULO') || this.authService.hasRole('ROL_SIAN_ITZ_MOD_ARTICULO') || this.authService.hasRole('ROL_SIAN_ITZ_MASIVA_ARTICULO')) {
        proceso.items?.push({ label: 'Interfaz Artículo', icon: 'pi pi-fw pi-cog', routerLink: '/home/interfaz/interfaz-articulo', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_ITZ_DOWNLOAD_ARTICULO')) {
        proceso.items?.push({ label: 'Descargar Información', icon: 'pi pi-fw pi-download', routerLink: '/home/interfaz/export-articulos', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_ITZ_RESUMEN')) {
        proceso.items?.push({ label: 'Resumen de Interfaces', icon: 'pi pi-fw pi-file', routerLink: '/home/interfaz/resumen-interface', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_ITZ_REPROCESAR')) {
        proceso.items?.push({ label: 'Reprocesar Interfaces', icon: 'pi pi-fw pi-replay', routerLink: '/home/interfaz/reprocesar-intreface', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_ITZ_BLOQUEO')) {
        proceso.items?.push({ label: 'Bloquear Interfaces', icon: 'pi pi-fw pi-ban', routerLink: '/home/interfaz/bloquear', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_ITZ_RESUMEN_BLOQUEO')) {
        proceso.items?.push({ label: 'Resumen de Interfaces Bloqueadas', icon: 'pi pi-fw pi-file', routerLink: '/home/interfaz/resumen-bloqueo', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_ITZ_INCIDENTE')) {
        proceso.items?.push({ label: 'Incidentes Interfaces', icon: 'pi pi-fw pi-exclamation-triangle', routerLink: '/home/interfaz/incidente', routerLinkActiveOptions: {exact: true} });
      }

      menu.items?.push(mantenimiento);
      menu.items?.push(proceso);

      this.items.push(menu)
    }
  }

  generarMenuCuadratura(): void {
    if (this.authService.hasRole('ROL_SIAN_CUADRATURA')) {
      let menu: MenuItem = { label: 'Cuadraturas', icon: 'pi pi-fw pi-copy', items: [] };

      let mantenimiento: MenuItem = { label: 'Mantenimiento', icon: 'pi pi-fw pi-folder', items: [] };
      if (this.authService.hasRole('ROL_SIAN_CUAD_SOVOS_CONF')) {
        mantenimiento.items?.push({ label: 'Configuración', icon: 'pi pi-fw pi-table', routerLink: '/home/cuadratura/lista-configuracion', routerLinkActiveOptions: {exact: true} });
      }

      let proceso: MenuItem = { label: 'Proceso', icon: 'pi pi-fw pi-folder', items: [] };
      if (this.authService.hasRole('ROL_SIAN_CUAD_AGREGADOR_RAPPI')) {
        proceso.items?.push({ label: 'Rappi', icon: 'pi pi-fw pi-shopping-cart', routerLink: '/home/cuadratura/lista-cuadratura-rappi', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_CUAD_MALL')) {
        proceso.items?.push({ label: 'Mall', icon: 'pi pi-fw pi-home', routerLink: '/home/cuadratura/lista-cuadratura-mall', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_CUAD_URBANOVA')) {
        proceso.items?.push({ label: 'Urbanova', icon: 'pi pi-fw pi-home', routerLink: '/home/cuadratura/lista-cuadratura-urbanova', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_CUAD_SOVOS')) {
        proceso.items?.push({ label: 'SOVOS', icon: 'pi pi-fw pi-money-bill', routerLink: '/home/cuadratura/lista-cuadratura-sovos', routerLinkActiveOptions: {exact: true} });
      }

      menu.items?.push(mantenimiento);
      menu.items?.push(proceso);
      this.items.push(menu)
    }
  }

  generarMenuCierreTiendas(): void {
    if (this.authService.hasRole('ROL_SIAN_CIERRE')) {
      let menu: MenuItem = { label: 'Cierre de Tienda', icon: 'pi pi-fw pi-wallet', items: [] };

      let proceso: MenuItem = { label: 'Proceso', icon: 'pi pi-fw pi-folder', items: [] };
      if (this.authService.hasRole('ROL_SIAN_CIERRE_DIA')) {
        proceso.items?.push({ label: 'Cierre Día', icon: 'pi pi-fw pi-wallet', routerLink: '/home/cierre/cierre-dia', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_CIERRE_CAJA_CHICA')) {
        proceso.items?.push({ label: 'Caja Chica', icon: 'pi pi-fw pi-money-bill', routerLink: '/home/cierre/caja-chica', routerLinkActiveOptions: {exact: true} });
      }

      let reporte: MenuItem = { label: 'Reporte', icon: 'pi pi-fw pi-folder', items: [] };
      if (this.authService.hasRole('ROL_SIAN_CIERRE_REP_DEPOSITO')) {
        reporte.items?.push({ label: 'Reporte de Depósitos', icon: 'pi pi-fw pi-list', routerLink: '/home/cierre/reporte-depositos', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_CIERRE_REP_TAB_CONTROL')) {
        reporte.items?.push({ label: 'Reporte Tablero de Control', icon: 'pi pi-fw pi-list', routerLink: '/home/cierre/tablero-control', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_CIERRE_REP_OTRA_CUADRATURA')) {
        reporte.items?.push({ label: 'Reporte de Otras Cuadraturas', icon: 'pi pi-fw pi-list', routerLink: '/home/cierre/reporte-otras-cuadraturas', routerLinkActiveOptions: {exact: true} });
      }

      menu.items?.push(proceso);
      menu.items?.push(reporte);
      this.items.push(menu)
    }
  }

  generarMenuReporte(): void {
    if (this.authService.hasRole('ROL_SIAN_REPORTE')) {
      let menu: MenuItem = { label: 'Reportes de Gestión', icon: 'pi pi-fw pi-copy', items: [] };

      let gestion: MenuItem = { label: 'Gestión', icon: 'pi pi-fw pi-folder', items: [] };
      if (this.authService.hasRole('ROL_SIAN_REPORTE_CYBER')) {
        gestion.items?.push({ label: 'Cyber', icon: 'pi pi-fw pi-file', routerLink: '/home/reporte/cyber', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_REP_GES_VTA_LOCATARIO')) {
        gestion.items?.push({ label: 'Ventas Locatarios', icon: 'pi pi-fw pi-file', routerLink: '/home/reporte/reporte-gestion-vta-locatario', routerLinkActiveOptions: {exact: true} });
      }
      
      if (this.authService.hasRole('ROL_SIAN_REP_GES_PROSEGUR')) {
        gestion.items?.push({ label: 'Prosegur', icon: 'pi pi-fw pi-file', routerLink: '/home/reporte/reporte-gestion-prosegur', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_REP_GES_VENTAS')) {
        gestion.items?.push({ label: 'Ventas', icon: 'pi pi-fw pi-file', routerLink: '/home/reporte/reporte-gestion-ventas', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_REP_GES_VTA_FORMA_PAGO')) {
        gestion.items?.push({ label: 'Ventas por Forma de Pago', icon: 'pi pi-fw pi-file', routerLink: '/home/reporte/reporte-gestion-pago', routerLinkActiveOptions: {exact: true} });
        // gestion.items?.push({ label: 'Gestion clientes', icon: 'pi pi-fw pi-file', routerLink: '/home/reporte/reporte-gestion-cliente', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_REP_GES_RENDIDO_TARJETA')) {
        gestion.items?.push({ label: 'Rendido por Tarjetas', icon: 'pi pi-fw pi-file', routerLink: '/home/reporte/reporte-gestion-rendido-tarjeta', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_REP_GES_PAG_COB_EFECTIVO')) {
        gestion.items?.push({ label: 'Pagado/Cobrado de Efectivo', icon: 'pi pi-fw pi-file', routerLink: '/home/reporte/reporte-gestion-pago-efectivo', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_REP_GES_AGREGADOR')) {
        gestion.items?.push({ label: 'Ventas PEYA/Rappi', icon: 'pi pi-fw pi-file', routerLink: '/home/reporte/reporte-gestion-agregador', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_REP_GES_CALL_VENTA')) {
        gestion.items?.push({ label: 'Call Center - Base de Ventas', icon: 'pi pi-fw pi-file', routerLink: '/home/reporte/reporte-gestion-call-1', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_REP_GES_CALL_MEMBRESIA')) {
        gestion.items?.push({ label: 'Call Center - Membresias', icon: 'pi pi-fw pi-file', routerLink: '/home/reporte/reporte-gestion-call-2', routerLinkActiveOptions: {exact: true} });
      }

      let control: MenuItem = { label: 'Control', icon: 'pi pi-fw pi-folder', items: [] };

      if (this.authService.hasRole('ROL_SIAN_REP_CON_VENTAS')) {
        control.items?.push({ label: 'Ventas', icon: 'pi pi-fw pi-file', routerLink: '/home/reporte/reporte-control-ventas', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_REP_CON_CRM')) {
        control.items?.push({ label: 'CRM', icon: 'pi pi-fw pi-file', routerLink: '/home/reporte/reporte-control-crm', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_REP_CON_REDIMIDO')) {
        control.items?.push({ label: 'Redimido', icon: 'pi pi-fw pi-file', routerLink: '/home/reporte/reporte-redimido', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_REP_CON_VALE_ALIMENTO')) {
        control.items?.push({ label: 'Vales', icon: 'pi pi-fw pi-file', routerLink: '/home/reporte/reporte-control-vales', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_REP_CON_COMPARATIVO')) {
        control.items?.push({ label: 'Comparativo Horas', icon: 'pi pi-fw pi-file', routerLink: '/home/reporte/reporte-control-comparativo-horas', routerLinkActiveOptions: {exact: true} });
      }

      let configuracion: MenuItem = { label: 'Configuración', icon: 'pi pi-fw pi-folder', items: [] };
    
      if (this.authService.hasRole('ROL_SIAN_REP_EJECUTAR_CONSULTA')) {
        configuracion.items?.push({ label: 'Ejecutar Transacción', icon: 'pi pi-fw pi-file', routerLink: '/home/reporte/lista-reporte', routerLinkActiveOptions: {exact: true} });
      }
      
      menu.items?.push(gestion);
      menu.items?.push(control);
      menu.items?.push(configuracion);
      this.items.push(menu)
    }
  }

  generarMenuCallCenter(): void {
    if (this.authService.hasRole('ROL_SIAN_CALL_CENTER')) {
      let menu: MenuItem = { label: 'Call Center', icon: 'pi pi-fw pi-phone', items: [] };
      
      if (this.authService.hasRole('ROL_SIAN_CALL_DOWNLOAD')) {
        let proceso: MenuItem = { label: 'Proceso', icon: 'pi pi-fw pi-folder', items: [] };
        proceso.items?.push({ label: 'Descarga Clientes', icon: 'pi pi-fw pi-download', routerLink: '/home/reporte/download-call', routerLinkActiveOptions: {exact: true} });

        menu.items?.push(proceso);
      }

      if (this.authService.hasRole('ROL_SIAN_CALL_CONSULTA')) {
        let consulta: MenuItem = { label: 'Consulta', icon: 'pi pi-fw pi-folder', items: [] };
        consulta.items?.push({ label: 'Clientes', icon: 'pi pi-fw pi-list', routerLink: '/home/reporte/consulta-call', routerLinkActiveOptions: {exact: true} });

        menu.items?.push(consulta);
      }

      this.items.push(menu);
    }
  }

  generaMenuSeguridad(): void {
    if (this.authService.hasRole('ROL_SIAN_SEGURIDAD')) {
      let menu: MenuItem = { label: 'Seguridad', icon: 'pi pi-fw pi-shield', items: [] };

      let mantenimiento: MenuItem = { label: 'Mantenimiento', icon: 'pi pi-fw pi-folder', items: [] };
      if (this.authService.hasRole('ROL_SIAN_SEG_APLICACION')) {
        mantenimiento.items?.push({ label: 'Aplicación', icon: 'pi pi-fw pi-desktop', routerLink: '/home/seguridad/lista-aplicacion', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_SEG_ROL')) {
        mantenimiento.items?.push({ label: 'Rol', icon: 'pi pi-fw pi-tag', routerLink: '/home/seguridad/lista-rol', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_SEG_GRUPO')) {
        mantenimiento.items?.push({ label: 'Grupo', icon: 'pi pi-fw pi-home', routerLink: '/home/seguridad/lista-grupo', routerLinkActiveOptions: {exact: true} });
      }
      
      let proceso: MenuItem = { label: 'Proceso', icon: 'pi pi-fw pi-folder', items: [] };
      if (this.authService.hasRole('ROL_SIAN_SEG_USUARIO')) {
        proceso.items?.push({ label: 'Usuario', icon: 'pi pi-fw pi-user', routerLink: '/home/seguridad/lista-usuario', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_SEG_LIBERAR_IP')) {
        proceso.items?.push({ label: 'Liberar IPs', icon: 'pi pi-fw pi-unlock', routerLink: '/home/seguridad/lista-ips', routerLinkActiveOptions: {exact: true} });
      }
      
      let consulta: MenuItem = { label: 'Consulta', icon: 'pi pi-fw pi-folder', items: [] };
      if (this.authService.hasRole('ROL_SIAN_SEG_INICIO_SESION')) {
        consulta.items?.push({ label: 'Inicios de Sesión', icon: 'pi pi-fw pi-id-card', routerLink: '/home/seguridad/consultar-inicio-sesion', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_SEG_ROL_X_USUARIO')) {
        consulta.items?.push({ label: 'Roles por Usuario', icon: 'pi pi-fw pi-list', routerLink: '/home/seguridad/consultar-roles-usuario', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_SEG_ROL_X_APLICACION')) {
        consulta.items?.push({ label: 'Roles por Aplicación', icon: 'pi pi-fw pi-list', routerLink: '/home/seguridad/consultar-roles-aplicacion', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_SEG_USUARIO_X_APLICACION')) {
        consulta.items?.push({ label: 'Usuarios por Aplicación', icon: 'pi pi-fw pi-list', routerLink: '/home/seguridad/consultar-usuarios-aplicacion', routerLinkActiveOptions: {exact: true} });
      }

      if (this.authService.hasRole('ROL_SIAN_SEG_USUARIO_X_ROL')) {
        consulta.items?.push({ label: 'Usuarios por Rol', icon: 'pi pi-fw pi-list', routerLink: '/home/seguridad/consultar-usuarios-rol', routerLinkActiveOptions: {exact: true} });
      }

      menu.items?.push(mantenimiento);
      menu.items?.push(proceso);
      menu.items?.push(consulta);

      this.items.push(menu);
    }
  }

  private changePassword() {
    const username = this.authService.usuario.username;

    this.spinner.show()
    this.authService.changePassword(username).subscribe(
      response => {
        const url = response.url;
        console.log(url);

        this.spinner.hide();
        window.open(url, '_blank');
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al realizar el cambio de contraseña', 'error');
      }
    )
  }

}
