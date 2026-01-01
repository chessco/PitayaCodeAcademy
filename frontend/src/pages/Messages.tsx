import React from 'react';
import { Bell, Search, Filter, MoreHorizontal } from 'lucide-react';

export default function Messages() {
    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Mensajes</h1>
                    <p className="text-[13px] text-gray-500 font-medium">Comunícate directamente con tus estudiantes.</p>
                </div>
                <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center shadow-xl shadow-primary/20">
                    NUEVO MENSAJE
                </button>
            </div>

            <div className="bg-[#111114] border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl min-h-[500px]">
                <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar en conversaciones..."
                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-xs font-medium text-gray-300 focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center p-20 text-center">
                    <div className="max-w-xs space-y-4">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto">
                            <Bell className="w-10 h-10 text-white/10" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Buzón vacío</h3>
                        <p className="text-sm text-gray-500 font-medium">Aún no has recibido mensajes de tus estudiantes. Los nuevos mensajes aparecerán aquí.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
