import { ContextMenu, Flex } from '@radix-ui/themes'
import { useFrappeGetCall, useFrappePostCall } from 'frappe-react-sdk'
import { TiArrowBackOutline } from 'react-icons/ti'
import { Poll } from '../Renderers/PollMessage'
import { Message } from '../../../../../../../types/Messaging/Message'
import { toast } from '@/hooks/useToast'

interface RetractVoteProps {
    message: Message
}

export const RetractVote = ({ message }: RetractVoteProps) => {

    // fetch poll data using message_id
    const { data } = useFrappeGetCall<{ message: Poll }>('raven.api.raven_poll.get_poll', {
        'message_id': message?.name,
    }, `poll_data_${message?.poll_id}`, {
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: false
    })

    const { call } = useFrappePostCall('raven.api.raven_poll.retract_vote')
    const onRetractVote = () => {
        return call({
            poll_id: message?.poll_id,
        }).then(() => {
            toast({
                title: 'Vote retracted',
                variant: 'accent',
                duration: 800,
            })
        }).catch(() => {
            toast({
                title: 'Could not retract vote',
                variant: 'destructive',
                duration: 800,
            })
        })
    }

    if (data && data.message?.current_user_votes.length > 0)
        return (
            <>
                <ContextMenu.Item onClick={onRetractVote} disabled={data.message?.poll.is_disabled ? true : false}>
                    <Flex gap='2'>
                        <TiArrowBackOutline size='18' />
                        Retract vote
                    </Flex>
                </ContextMenu.Item>
                <ContextMenu.Separator />
            </>
        )

    return null
}