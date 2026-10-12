import re

with open('public/mobile-app.js', 'r', encoding='utf-8') as f:
    text = f.read()

new_content = """      <div className="chat-composer-panel">
        <div className="chat-model-row"><label htmlFor="chat-model-choice">Model AI</label><select id="chat-model-choice" value={modelChoice} onChange={e=>setModelChoice(e.target.value)}><option value="auto">Auto — Multi-AI</option>{providerModelOptions.map(p => <optgroup key={p.id} label={providerGroupLabel(p)} disabled={!p.configured}>{p.modelOptions.map(model => <option key={`${p.id}:${model}`} value={`${p.id}::${model}`}>{model}</option>)}</optgroup>)}</select></div>
        
        <div className="chat-upload-bar pro-upload mobile-chat-uploads" style={{ display: showUploads ? 'flex' : 'none', overflowX: 'auto', gap: '8px', paddingBottom: '4px' }}>
          <button type="button" onClick={()=>imageInputRef.current?.click()}>🖼️ <span>Tải ảnh</span></button>
          <button type="button" onClick={()=>cameraInputRef.current?.click()}>📷 <span>Chụp ảnh</span></button>
          <button type="button" onClick={()=>fileInputRef.current?.click()}>📎 <span>Tải file</span></button>
          {attachments.length > 0 && <button type="button" className="chat-clear-files" onClick={()=>{setAttachments([]);setFileNotice('');}}>Xóa hết</button>}
          <input ref={imageInputRef} className="chat-hidden-input" type="file" accept="image/*" multiple onChange={e=>{addFiles(e.target.files);e.target.value='';setShowUploads(false);}} />
          <input ref={cameraInputRef} className="chat-hidden-input" type="file" accept="image/*" capture="environment" onChange={e=>{addFiles(e.target.files);e.target.value='';setShowUploads(false);}} />
          <input ref={fileInputRef} className="chat-hidden-input" type="file" accept="image/*,.pdf,.txt,.md,.csv,.json,.xml,.html,.js,.ts,.py,.log,.css,.doc,.docx,.xls,.xlsx" multiple onChange={e=>{addFiles(e.target.files);e.target.value='';setShowUploads(false);}} />
        </div>

        {attachments.length > 0 && <div className="chat-attachment-list" style={{padding: '0 8px'}}>{attachments.map(item => <span className="chat-file-chip" key={item.id} style={{background: 'rgba(255,255,255,0.1)'}}>{item.file.type.startsWith('image/')?'🖼️':'📄'} {item.file.name}<button type="button" aria-label={`Xóa ${item.file.name}`} title={`Xóa ${item.file.name}`} onClick={()=>removeFile(item.id)}>x</button></span>)}</div>}
        {fileNotice && <div className="chat-file-notice" role="status" style={{padding: '0 8px'}}>{fileNotice}</div>}
        {attachments.length > 0 && modelChoice !== 'auto' && !modelChoice.startsWith('gemini::') && <div className="chat-attachment-note" style={{padding: '0 8px'}}>Ảnh/file hiện được phân tích qua Gemini đa phương thức.</div>}
        {voiceStatus && <div className="chat-voice-status" role="status" style={{padding: '0 8px'}}>{voiceStatus}{voiceCountdown > 0 && <> <b>Gửi sau {voiceCountdown}s</b> <button type="button" onClick={()=>clearVoiceCountdown('Đã hủy tự động gửi.')}>Hủy</button></>}</div>}

        <div className="composer chat-pill-composer" style={{display: 'flex', flexDirection: 'row', alignItems: 'center', background: 'rgba(30, 30, 35, 0.7)', borderRadius: '30px', padding: '6px 6px'}}>
          <button type="button" onClick={() => setShowUploads(!showUploads)} style={{color:'#fff', background:'transparent', border:0, fontSize:'24px', width:'36px', height:'36px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink: 0, paddingBottom: '3px'}}>+</button>
          
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, margin: '0 6px'}}>
            <textarea value={text} onChange={e=>{draftRef.current=e.target.value;if(voiceCountdown)clearVoiceCountdown('Đã hủy tự động gửi do bạn chỉnh sửa nội dung.');setText(e.target.value);}} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Hỏi AI..." aria-label="Tin nhắn gửi AI" rows="1" style={{background: 'transparent', border: 0, color: '#fff', fontSize: '15px', padding: '4px 0', resize: 'none', outline: 'none', width: '100%', boxShadow: 'none'}} />
          </div>

          <div style={{display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0}}>
            {listening ? <button type="button" className="chat-mic-btn is-listening" aria-label="Dừng ghi âm" title="Dừng ghi âm" onClick={stopDictation} style={{background:'transparent', border:0, fontSize:'20px'}}>🛑</button> : <button type="button" className="chat-mic-btn" aria-label="Nhập bằng giọng nói" title="Nhập bằng giọng nói" disabled={busy} onClick={startDictation} style={{background:'transparent', border:0, fontSize:'20px'}}>🎤</button>}
            {text.trim() || attachments.length > 0 || busy ? <button type="button" className={`pill-send-btn ${busy?'is-stop':''}`} aria-label={busy?'Dừng phản hồi':'Gửi tin nhắn'} title={busy?'Dừng phản hồi':'Gửi tin nhắn'} onClick={busy?stopResponse:()=>send()} style={{background: 'transparent', border: 0, fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center'}}>{busy?'🛑':'➤'}</button> : null}
          </div>
        </div>
      </div>
    </section>;"""

start_idx = text.find('<div className="chat-composer-panel">')
end_idx = text.find('</section>;', start_idx)
if start_idx != -1 and end_idx != -1:
    old_panel_actual = text[start_idx:end_idx] + '</section>;'
    text = text.replace(old_panel_actual, new_content)
    with open('public/mobile-app.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print("mobile-app.js replaced correctly!")
else:
    print("Could not find the block.")
