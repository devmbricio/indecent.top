'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { useParams } from 'next/navigation';
import { Loader } from 'lucide-react';

import { useGetCallById } from '@/hooks/useGetCallById';
import Alert from '@/components/Alert';
import MeetingSetup from '@/components/MeetingSetup';
import MeetingRoom from '@/components/MeetingRoom';

const MeetingPage = () => {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const { call, isCallLoading } = useGetCallById(id);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if (status === 'loading' || isCallLoading) return <Loader />;

  if (!call) return (
    <p className="text-center text-3xl font-bold text-gray-300">
      Call Not Found
    </p>
  );

  // get more info about custom call type:  https://getstream.io/video/docs/react/guides/configuring-call-types/
  const notAllowed = call.type === 'invited' && (!session?.user || !call.state.members.find((m) => m.user.id === session.user.id));

  if (notAllowed) return <Alert title="You are not allowed to join this meeting" />;

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>

        {!isSetupComplete ? (
          <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
        ) : (
          <MeetingRoom />
        )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default MeetingPage;

/*
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { Loader } from 'lucide-react';

import { useGetCallById } from '@/hooks/useGetCallById';
import MeetingSetup from '@/components/MeetingSetup';
import MeetingRoom from '@/components/MeetingRoom';

const LiveCreatePage = () => {
  const { id: influencerId } = useParams();
  const { data: session, status } = useSession();
  const { call, isCallLoading } = useGetCallById(influencerId);

  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if (status === 'loading' || isCallLoading) {
    return <Loader />;
  }

  if (!session?.user || session.user.id !== influencerId) {
    return (
      <p className="text-center text-3xl font-bold text-gray-300">
        Você não tem permissão para acessar esta live.
      </p>
    );
  }

  if (!call) {
    return (
      <p className="text-center text-3xl font-bold text-gray-300">
        Live não encontrada.
      </p>
    );
  }

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default LiveCreatePage;
*/

/* funcional ultimaversao
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { useParams } from 'next/navigation';
import { Loader } from 'lucide-react';

import { useGetCallById } from '@/hooks/useGetCallById';
import Alert from '@/components/Alert';
import MeetingSetup from '@/components/MeetingSetup';
import MeetingRoom from '@/components/MeetingRoom';

const MeetingPage = () => {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const { call, isCallLoading } = useGetCallById(id);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if (status === 'loading' || isCallLoading) return <Loader />;

  if (!call) return (
    <p className="text-center text-3xl font-bold text-gray-300">
      Call Not Found
    </p>
  );

  // get more info about custom call type:  https://getstream.io/video/docs/react/guides/configuring-call-types/
  const notAllowed = call.type === 'invited' && (!session?.user || !call.state.members.find((m) => m.user.id === session.user.id));

  if (notAllowed) return <Alert title="You are not allowed to join this meeting" />;

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>

        {!isSetupComplete ? (
          <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
        ) : (
          <MeetingRoom />
        )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default MeetingPage;
*/

/*
'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { useParams } from 'next/navigation';
import { Loader } from 'lucide-react';

import { useGetCallById } from '@/hooks/useGetCallById';
import Alert from '@/components/Alert';
import MeetingSetup from '@/components/MeetingSetup';
import MeetingRoom from '@/components/MeetingRoom';

const MeetingPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();
  const { call, isCallLoading } = useGetCallById(id);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if (!isLoaded || isCallLoading) return <Loader />;

  if (!call) return (
    <p className="text-center text-3xl font-bold text-gray-300">
      Call Not Found
    </p>
  );

  // get more info about custom call type:  https://getstream.io/video/docs/react/guides/configuring-call-types/
  const notAllowed = call.type === 'invited' && (!user || !call.state.members.find((m) => m.user.id === user.id));

  if (notAllowed) return <Alert title="You are not allowed to join this meeting" />;

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>

        {!isSetupComplete ? (
          <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
        ) : (
          <MeetingRoom />
        )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default MeetingPage;
*/