import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {
  Key,
  Style,
  Type,
} from 'mesop/mesop/protos/ui_jspb_proto_pb/mesop/protos/ui_pb';
import {HtmlType} from 'mesop/mesop/components/html/html_jspb_proto_pb/mesop/components/html/html_pb';
import {formatStyle} from '../../web/src/utils/styles';
import {setIframeSrcDoc} from '../../web/src/safe_iframe/safe_iframe';

@Component({
  selector: 'mesop-html',
  templateUrl: 'html.ng.html',
  standalone: true,
})
export class HtmlComponent {
  @Input({required: true}) type!: Type;
  @Input() key!: Key;
  @Input() style!: Style;
  @ViewChild('iframe', {read: ElementRef}) iframe!: ElementRef;
  private _config!: HtmlType;
  private srcDoc!: string;

  ngOnChanges() {
    this._config = HtmlType.deserializeBinary(
      this.type.getValue() as unknown as Uint8Array,
    );
    const previousSrcDoc = this.srcDoc;
    this.srcDoc = this._config.getHtml()!;

    // Reload iframe if the URL has changed.
    if (
      this.srcDoc !== previousSrcDoc &&
      this.iframe &&
      this.iframe.nativeElement
    ) {
      this.loadIframe();
    }
  }

  ngAfterViewInit() {
    this.loadIframe();
  }

  loadIframe() {
    setIframeSrcDoc(this.iframe.nativeElement, this.srcDoc);
  }

  config(): HtmlType {
    return this._config;
  }

  getStyle(): string {
    return formatStyle(this.style);
  }
}
