"use client";

import Link from "next/link";
import { Info, Newspaper, Briefcase, Mail, Shield, FileText } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full font-custom bg-black/10 text-gray-400 pt-1">
            {/* Links e Newsletter */}
            <div className="lg:grid grid-cols-2 lg:px-1 lg:py-1 gap-1">
                {/* Links principais */}
                <div className="grid grid-cols-6 lg:gap-0 gap-1 pb-2 lg:pb-0 justify-center lg:justify-start lg:pl-4">
                <Link className="flex items-center gap-0 hover:underline" href="/Sobre">
                    <Info className="w-5 h-5" />
                </Link>
                <Link className="flex items-center gap-0 hover:underline" href="/Imprensa">
                    <Newspaper className="w-5 h-5" />
                </Link>
                <Link className="flex items-center gap-0 hover:underline" href="/Carreiras">
                    <Briefcase className="w-5 h-5" />
                </Link>
                <Link className="flex items-center gap-0 hover:underline" href="/Contato">
                    <Mail className="w-5 h-5" />
                </Link>
                <Link className="flex items-center gap-0 hover:underline" href="/privacidade">
                    <Shield className="w-5 h-5" /> 
                </Link>
                <Link className="flex items-center gap-0 hover:underline" href="/termos">
                     <FileText className="w-5 h-5" /> 
                </Link>
            </div>

                {/* Newsletter */}
                <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-end gap-4">
                    
                    <div className="relative w-full lg:max-w-sm">
                        <input
                            className="w-full px-3 pr-12 border rounded-full h-8 text-sm bg-gray-100"
                            type="email"
                            placeholder="Email"
                        />
                        <button className="absolute h-6 px-3 text-sm text-gray-400 bg-gray-300 hover:bg-gray-600 rounded-full top-1 bottom-1 right-2">
                            Inscrever-se
                        </button>
                    </div>
                </div>
            </div>

            {/* Copy Right */}
            <div className="bg-[#A99031] bg-opacity-0 pb-2">
                <div className="flex flex-col lg:flex-row justify-between items-center text-center lg:text-left lg:pl-6">
                    <p className="lg:text-sm text-[10px]">
                        &copy;2024 indecent.top | Powered by{" "}
                        <a
                            href="https://macaco.network"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                        >
                            MaCaCo.NetWork
                        </a>{" "}
                        | All rights reserved
                    </p>
                    <div className="grid grid-cols-2 gap-6 mt-2 lg:mt-0 mr-4">
                        
                    </div>
                </div>
            </div>
        </footer>
    );
}




/*
import Link from "next/link";

export default function Footer() {
    return (
        <div className="font-custom">
            <div className="lg:grid lg:grid-cols-2 pl-4 pb-1 z-50 pr-4  md:text-[12px] text-[8px]">
                <div className="flex flex-wrap gap-8 pb-0 text-left lg:pb-0 text-gray-400">
                    <div>
                        <div className="flex flex-row space-x-4">
                            <Link className="py-1 hover:underline" href="/Sobre">Sobre</Link>
                            <Link className="py-1 hover:underline" href="/Imprensa">Imprensa</Link>
                            <Link className="py-1 hover:underline" href="/Carreiras">Carreiras</Link>
                            <Link className="py-1 hover:underline" href="/Contato">Contato</Link>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row md:justify-end justify-center mr-0 pb-0 items-center gap-2 text-gray-400">
                    <p className="md:text-1xl text-[10px]">Newsletter</p>
                    <div className="relative lg:max-w-sm">
                        <input className="w-full px-2 pr-10 border-2 rounded-full md:h-8 h-6 md:text-1xl text-[10px] bg-gray-300" type="text" placeholder="Email" />
                        <button className="absolute md:h-4.5 h-5 px-3 md:text-sm text-[10px] text-gray-300 bg-[#e8d3e8ff] hover:bg-gray-600 rounded-full top-1.5 right-2">Inscrever-se</button>
                    </div>
                </div>
            </div>  
 
            <div className="bg-[#A99031] bg-opacity-0 z-50 md:pl-4  md:pr-4 pl-2 pr-2 md:text-[12px] text-[8px]">
            <div className="text-center text-gray-400 lg:justify-between lg:flex">
                <div className="pb-4 lg:pb-0">
                <p>&copy;2024 indecent.top | Powered by <a href="https://macaco.network" target="_blank" rel="noopener noreferrer" className="underline">MaCaCo.NetWork</a> | All rights reserved </p>
                </div>
                <div>
                <Link className="p-2 hover:underline" href="/privacidade">Privacidade</Link>
                <Link className="p-2 hover:underline" href="/termos">Termos</Link>
                </div>
            </div>
            </div>
        </div>
    )
}
*/


/*
import Link from "next/link";


export default function Footer() {

    return (
        <div className="bg-zinc-100 font-custom ">
 
            <div className="container lg:grid lg:grid-cols-2 p-2 z-50">
                <div className="grid gap-4 pb-4 text-left lg:pb-0 lg:grid-cols-3 text-gray-400">
                    <div>
                        <h2 className="pb-4 flex text-1xl font-semibold">EMPRESA</h2>
                        <div className="flex flex-col ">
                            <Link className="py-1 hover:underline" href="/about">Sobre nós</Link>
                            <Link className="py-1 hover:underline" href="/press">Imprensa</Link>
                            <Link className="py-1 hover:underline" href="/careers">Carreiras</Link>
                            <Link className="py-1 hover:underline" href="/contact">Contato</Link>
                        </div>
                    </div>
             
                
                </div>
                <div className="pt-4 text-center border-t-2 lg:pt-0 lg:text-left lg:border-0 lg:pl-20 text-gray-400 ">
                    <p className="pb-4 text-1xl font-semibold">NEWSLETTER</p>
                    <div className="relative lg:max-w-sm">
                        <input className="w-full px-4 pr-20 border-2 border-gray-400 rounded-full h-14" type="text" placeholder="Email" />
                        <button className="absolute h-10 px-3 text-sm text-gray-300 bg-black rounded-full top-2 right-2 hover:border-2 hover:border-black hover:bg-white hover:text-black">Inscrever-se</button>
                    </div>
                    <p className="pt-4 text-gray-400 text-[12px]">
                    Ao assinar nossa newsletter, você concorda em receber nossos e-mails. Os seus dados pessoais serão armazenados e processados ​​de acordo com a nossa Política de Privacidade e você poderá cancelar a assinatura a qualquer momento.
                    </p>
                </div>
            </div>

            
            <div className="p-2 bg-[#BC7C5C] backdrop-blur-lg bg-opacity-60 z-50">
                <div className="container text-center text-gray-300 lg:justify-between lg:flex">
                    <div className="pb-4 lg:pb-0">
                        <p>&copy;2024 Camila Chalon Arquitetura | Powered by MaCaCo.NetWork | All rights reserved </p>
                    </div>
                    <div className="">
                        <Link className="p-4 hover:underline" href="/privacy">Privacy</Link>
                        <Link className="p-4 hover:underline" href="/terms">Terms</Link>
                    </div>
                </div>
            </div>
  
        </div>
    )
}
*/