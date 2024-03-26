import { useFrappePostCall } from 'frappe-react-sdk'
import { useRef, useState } from 'react'
import { FileUploadModal } from './FileUploadModal';
import { Tiptap } from './Tiptap';

type Props = {
    channelID: string,
    allMembers: { id: string; value: string }[],
    allChannels: { id: string; value: string; }[],
    onMessageSend: () => void,
}
export const ChatInput = ({ channelID, allChannels, allMembers, onMessageSend }: Props) => {

    const { call, loading } = useFrappePostCall('raven.api.raven_message.send_message')

    const [files, setFiles] = useState<File[]>([])

    const onSubmit = async (message: string, json: any) => {
        return call({
            channel_id: channelID,
            text: message,
            json,
            is_reply: 0,
            linked_message: null,
        }).then(() => {
            onMessageSend()
        })
    }

    const fileInputRef = useRef<HTMLInputElement>(null)

    const pickFiles = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const getFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles: File[] = []

        if (e.target.files) {
            for (let i = 0; i < e.target.files.length; i++) {
                newFiles.push(e.target.files[i])
            }
        }

        setFiles(f => [...f, ...newFiles])
    }

    return (
        <div className='flex justify-between items-end content-start px-4 py-2 overflow-visible space-x-2'>
            <div className='overflow-x-hidden w-full'>
                <Tiptap onMessageSend={onSubmit} messageSending={loading} onPickFiles={pickFiles} onGetFiles={getFiles} fileRef={fileInputRef}/>
            </div>
            <FileUploadModal channelID={channelID} files={files} setFiles={setFiles} pickFiles={pickFiles} onMessageSend={onMessageSend} />
        </div>
    )
}