fleet Overview
====================
fleet simulator for the Modern data center. This does not actually provision software or hardware, but similates how
it happens in a multi, hybrid cloud environment. There are three subsystems of the architecture.
:ref:`SubSystem-Application-Stack`, :ref:`SubSystem-Cloud-Stack`, :ref:`SubSystem-Hardware-Stack`. Vehicles are
connected to the Data Center via the Services and the Cloud layer.

.. toctree::
   :maxdepth: 2
   :caption: Users

   Actor/index


.. toctree::
   :maxdepth: 2
   :caption: High Level Use Cases

   UseCase/index


.. image:: UseCases/UseCases.png

Logical Architecture
--------------------
The architecture consists of 3 layers: :ref:`SubSystem-Application-Stack`, :ref:`SubSystem-Cloud-Stack`,
and :ref:`SubSystem-Hardware-Stack`. Details of the architecture can be found in the SubSystem documentation.
The Application Stack maps to Cloud Stack (Virtualized) resources which are mapped to physical hardware.

A Web interface to the simulator gives the ability to visually see how the data center reacts to changes in number
of vehicles, applications, hardware changes, and outages.

.. image:: Architecture.png

.. toctree::
   :maxdepth: 2
   :caption: Sub System

   Solution/index


Deployment model
----------------

This simulator can be deployed through a simple container. The container consists of a sailsjs application.
The Web Interface is used to visualize the simulation. The simulation can be driven with the scripting interface on
the command line or via a REST interface.

.. image:: Solution/Physical.png

